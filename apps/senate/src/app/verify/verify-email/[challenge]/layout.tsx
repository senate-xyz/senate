export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className='min-h-screen bg-[#1E1B20] lg:pl-[92px]'>{children}</div>
    )
}
