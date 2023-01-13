export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return <div className='mt-[16px] flex flex-col'>{children}</div>
}
