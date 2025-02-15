import {cn} from "@/lib/utils";
import {TContentType} from "@/app/new-signin/content/types";
import {memo} from "react";

export const ContentTypeItem = memo(({
                                  content,
                                  isSelected,
                                  onSelect
                              }: {
    content: TContentType;
    isSelected: boolean;
    onSelect: (id: number) => void;
}) => (

    <div
        onClick={() => onSelect(content.contentTypeId)}
        className={cn(
            "p-5 bg-[#fafafa] hover:bg-neutral-200 flex items-center justify-center",
            "text-center cursor-pointer border-2 border-yinmn-blue rounded-[20px] text-xl",
            "transition-colors duration-200 ease-in-out",
            isSelected && "bg-neutral-200"
        )}
    >
        <p>{content.contentTypeName}</p>
    </div>
));
ContentTypeItem.displayName = 'ContentTypeItem';
