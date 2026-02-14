<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    public function index(Request $request)
    {
        // 1. Inputs from React (Search, Page, Limit)
        $search = $request->input('search');
        $limit = $request->input('limit', 10); // Default to 10 items

        // 2. Start query with only necessary columns
        $query = User::query()
            ->select(['id', 'name', 'email', 'profile_pic', 'status', 'role', 'created_at']);

        // 3. Optimized Search Logic
        // We use 'when' to only apply the search if the user has typed something
        $query->when($search, function ($q) use ($search) {
            return $q->where(function ($sub) use ($search) {
                $sub->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('email', 'LIKE', "%{$search}%");
            });
        });

        // 4. Sorting: Newest users first
        $query->orderBy('id', 'asc');

        // 5. Execute Pagination
        // This automatically reads the 'page' variable from the React request
        $users = $query->paginate($limit);

        // 6. Return Structured JSON
        return response()->json([
            'status' => 'success',
            'users' => $users->items(), // The current page data
            'totalPages' => $users->lastPage(), // Total pages available
            'totalUsers' => $users->total(), // Total count for "100K users" label
            'currentPage' => $users->currentPage(),
        ], 200);
    }

    public function createUser(Request $request)
    {
        // Validate request
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'role' => ['required', Rule::in(['admin', 'manager', 'employee'])],
            'password' => 'required|string|min:8|confirmed', // confirms password_confirmation
        ]);

        // Create user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
            'password' => Hash::make($request->password),
            'status' => 'active', // default
        ]);

        return response()->json([
            'message' => 'User created successfully',
            'user' => $user,
        ], 201);
    }

    // ✅ UPDATE name/email/role
    public function update(Request $request, User $user)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'min:3', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'role' => ['required', Rule::in(['admin', 'manager', 'employee'])],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'User updated successfully.',
            'user' => $user->fresh(),
        ]);
    }

    public function updatePassword(Request $request, User $user)
    {
        $validator = Validator::make($request->all(), [
            'password' => 'required|min:8|confirmed',
            'password_confirmation' => 'required|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        // ✅ Optional: revoke all tokens (recommended)
        $user->tokens()->delete();

        return response()->json([
            'status' => true,
            'message' => 'Password updated successfully.',
        ], 200);
    }

    public function changeStatus(Request $request, User $user)
    {
        // 1. Validate the requested status
        $request->validate([
            'status' => 'required|in:active,suspended',
        ]);

        $newStatus = $request->input('status');

        // 2. Prevent admin from suspending themselves
        if (auth()->id() === $user->id) {
            return response()->json([
                'status' => false,
                'message' => 'You cannot change your own status.',
            ], 403);
        }

        // 3. Update status
        $user->status = $newStatus;
        $user->save();

        // 4. Return success response
        return response()->json([
            'status' => true,
            'message' => "User status updated to {$newStatus}.",
            'user' => [
                'id' => $user->id,
                'status' => $user->status,
            ],
        ], 200);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json([
            'status' => true,
            'message' => 'User deleted successfully.',
        ]);
    }

}
