import { Modal } from "~/shared/components/modal"
import { PLACEHOLDER_CONTENT } from "./constants"
import type { CreateMovementPlaceholderProps } from "./interfaces"

export function CreateMovementPlaceholder({
  open,
  itemType,
  onClose,
}: Readonly<CreateMovementPlaceholderProps>) {
  if (!itemType) {
    return null
  }

  const content = PLACEHOLDER_CONTENT[itemType]

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={content.title}
      description={content.description}
    >
      <div className="flex items-center gap-3.5 rounded-[14px] border border-dashed border-[#9eb7ed] bg-[#f5f8ff] p-[22px]">
        <span
          className="grid size-10 flex-none place-items-center rounded-full bg-[#2458d1] text-[1.4rem] text-white"
          aria-hidden="true"
        >
          +
        </span>
        <p className="m-0 text-[#56647c]">{content.message}</p>
      </div>
    </Modal>
  )
}
