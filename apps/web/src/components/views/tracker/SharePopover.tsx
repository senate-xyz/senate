import { useSession } from 'next-auth/react'

export const SharePopover = () => {
    return (
        <div>
            <p>popover</p>
        </div>
        // <Popover>
        //   <PopoverTrigger>
        //     <Button>Share</Button>
        //   </PopoverTrigger>
        //   <PopoverContent>
        //     <PopoverArrow />
        //     <PopoverHeader>Share your voting stats</PopoverHeader>
        //     <PopoverBody>
        //       <Input
        //         value={`https://dev-senate-web.onrender.com/tracker/${session?.user?.name}`}
        //         onChange={() => {
        //           return;
        //         }}
        //       />
        //       <Button
        //         my="2"
        //         w="full"
        //         onClick={() => {
        //           navigator.clipboard.writeText(
        //             `https://dev-senate-web.onrender.com/tracker/${session?.user?.name}`
        //           );
        //         }}
        //       >
        //         Copy to clipboard
        //       </Button>
        //     </PopoverBody>
        //   </PopoverContent>
        // </Popover>
    )
}

export default SharePopover
