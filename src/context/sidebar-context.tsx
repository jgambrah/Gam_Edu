
"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import { useIsMobile } from "@/hooks/use-mobile"

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

type SidebarContext = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContext | null>(null)

export function SidebarProvider({
  children,
  collapsed,
}: React.ComponentProps<"div"> & {
  collapsed?: boolean
}) {
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const [state, setState] = React.useState<"expanded" | "collapsed">(
    collapsed ? "collapsed" : "expanded"
  )
  const [open, setOpen] = React.useState(true)
  const [openMobile, setOpenMobile] = React.useState(false)

  const toggleSidebar = () => {
    if (isMobile) {
      setOpenMobile(!openMobile)
    } else {
      setOpen(!open)
    }
  }

  // Set sidebar state from cookie.
  React.useEffect(() => {
    const cookie = document.cookie
      .split(";")
      .find((c) => c.trim().startsWith(`${SIDEBAR_COOKIE_NAME}=`))
    if (cookie) {
      const value = cookie.split("=")[1]
      if (value === "collapsed") {
        setOpen(false)
      }
    }
  }, [])

  // When `open` changes, update the cookie.
  React.useEffect(() => {
    document.cookie = `${SIDEBAR_COOKIE_NAME}=${
      open ? "expanded" : "collapsed"
    };path=/;max-age=${SIDEBAR_COOKIE_MAX_AGE}`
    setState(open ? "expanded" : "collapsed")
  }, [open])

  // When `pathname` changes, close the mobile sidebar.
  React.useEffect(() => {
    setOpenMobile(false)
  }, [pathname])

  // Listen for keyboard shortcut.
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        toggleSidebar()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [toggleSidebar])

  return (
    <SidebarContext.Provider
      value={{
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}
