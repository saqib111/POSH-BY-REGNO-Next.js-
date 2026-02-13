/** @format */

export default function HomePage() {
    return (
        <div className='space-y-4'>
            <h1 className='text-2xl font-semibold'>Welcome to POSH BY REGNO</h1>
            <p className='text-gray-600'>
                Dummy content for now. This will become your employee front
                store.
            </p>

            <div className='rounded-xl border bg-white p-6'>
                <p className='font-medium'>Featured Products (Coming soon)</p>
                <p className='text-sm text-gray-500'>
                    We will load products from Laravel API.
                </p>
            </div>
        </div>
    );
}
