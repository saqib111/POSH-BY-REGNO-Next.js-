/** @format */

export default function AdminDashboardPage() {
    return (
        <div className='grid gap-5 md:grid-cols-3'>
            <div className='rounded-2xl border border-white/10 bg-white/5 p-6'>
                <p className='text-[10px] font-black uppercase tracking-[0.35em] text-zinc-400'>
                    Users
                </p>
                <p className='mt-2 text-3xl font-black'>0</p>
            </div>

            <div className='rounded-2xl border border-white/10 bg-white/5 p-6'>
                <p className='text-[10px] font-black uppercase tracking-[0.35em] text-zinc-400'>
                    Products
                </p>
                <p className='mt-2 text-3xl font-black'>0</p>
            </div>

            <div className='rounded-2xl border border-white/10 bg-white/5 p-6'>
                <p className='text-[10px] font-black uppercase tracking-[0.35em] text-zinc-400'>
                    Orders
                </p>
                <p className='mt-2 text-3xl font-black'>0</p>
            </div>

            <div className='md:col-span-3 rounded-2xl border border-white/10 bg-white/5 p-6'>
                <p className='text-[10px] font-black uppercase tracking-[0.35em] text-zinc-400'>
                    Status
                </p>
                <p className='mt-2 text-sm text-zinc-300'>
                    Login redirect works. Next step is building admin sidebar +
                    CRUD pages.
                </p>
            </div>
        </div>
    );
}
