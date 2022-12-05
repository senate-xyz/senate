import RainbowConnect from './RainbowConnect'

const Dashboard = (props: { title: string; component: JSX.Element }) => {
    return (
        <div className="h-full min-h-screen w-full bg-black">
            <div className="flex w-full flex-col">
                <div className="flex h-48 items-center justify-between border border-x-0 border-t-0 border-[#545454] px-10">
                    <h1 className="text-[78px] text-white font-semibold">
                        {props.title}
                    </h1>
                    <RainbowConnect />
                </div>
                {props.component}
            </div>
        </div>
    )
}

export default Dashboard
