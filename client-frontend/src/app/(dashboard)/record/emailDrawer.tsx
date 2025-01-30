"use client"

import {
    DrawerActionTrigger,
    DrawerBackdrop,
    DrawerBody,
    DrawerCloseTrigger,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerRoot,
    DrawerTitle,
} from "@/components/ui/drawer"


interface EmailDrawerProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    selectedRecords: string[]
    onSendEmail: () => Promise<void>
}

export const EmailDrawer = ({ open, onOpenChange, selectedRecords, onSendEmail }: EmailDrawerProps) => {
    const handleSendEmail = async () => {
        await onSendEmail();
        onOpenChange(false);
    }

    return (
        <DrawerRoot open={open} onOpenChange={(e)=>onOpenChange(e.open)}>
            <DrawerBackdrop />
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>メール送信確認</DrawerTitle>
                </DrawerHeader>
                <DrawerBody>
                    <p className="text-gray-600">
                        選択された {selectedRecords.length} 件の名刺データに対してメールを送信します。
                        よろしいですか？
                    </p>
                </DrawerBody>
                <DrawerFooter>
                    <DrawerActionTrigger asChild>
                        <button
                            type="button"
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            onClick={() => onOpenChange(false)} // Keep passing boolean false to close
                        >
                            キャンセル
                        </button>
                    </DrawerActionTrigger>
                    <button
                        type="button"
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-500 disabled:bg-indigo-300"
                        onClick={handleSendEmail} // Call handleSendEmail on click
                        // disabled={} // Add disabled logic based on sending state if needed
                    >
                        送信する
                    </button>
                </DrawerFooter>
                <DrawerCloseTrigger />
            </DrawerContent>
        </DrawerRoot>
    )
}