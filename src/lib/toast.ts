import { toast } from "sonner"

export type ToastType = "success" | "error" | "warning" | "info"

export const showToast = (
  type: ToastType,
  message: string,
  description?: string
) => {
  switch (type) {
    case "success":
      toast.success(message, { description })
      break
    case "error":
      toast.error(message, { description })
      break
    case "warning":
      toast.warning(message, { description })
      break
    case "info":
      toast.info(message, { description })
      break
  }
}
