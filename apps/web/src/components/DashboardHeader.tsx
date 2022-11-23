import RainbowConnect from './RainbowConnect'

const DashboardHeader = (props: { title: string; component: JSX.Element }) => {
    return (
        <div className="min-h-screen w-full" data-cy="dashboard-header">
            <div className="h-full w-full bg-slate-700">
                <div className="flex w-full flex-col">
                    <div className="flex h-48 items-center justify-between bg-slate-800 px-10">
                        <h1 className="text-5xl">{props.title}</h1>
                        <RainbowConnect />
                    </div>
                    {props.component}
                </div>
            </div>
        </div>
    )
}

export default DashboardHeader
