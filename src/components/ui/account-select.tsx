"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Account } from "@/lib/types"

interface SearchableAccountSelectProps {
  accounts: Account[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchableAccountSelect({
  accounts,
  value,
  onChange,
  placeholder = "Select account..."
}: SearchableAccountSelectProps) {
  const [open, setOpen] = React.useState(false)

  const selectedAccount = React.useMemo(() => {
    return accounts.find((a) => a.id === value)
  }, [accounts, value])

  // Sort accounts alphabetically by code for display
  const sortedAccounts = React.useMemo(() => {
    return [...accounts].sort((a, b) => a.code.localeCompare(b.code))
  }, [accounts])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between rounded-xl font-bold bg-white text-slate-700 border-slate-200 hover:bg-slate-50 h-10 px-3"
        >
          {selectedAccount ? (
            <span className="truncate">
              {selectedAccount.code} - {selectedAccount.name}
            </span>
          ) : (
            <span className="text-muted-foreground font-normal text-xs">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 overflow-hidden rounded-xl border border-slate-100 shadow-xl bg-white z-50">
        <Command className="w-full">
          <CommandInput placeholder="Search by name or code..." className="h-10" />
          <CommandList className="max-h-[200px] overflow-y-auto w-full">
            <CommandEmpty className="p-3 text-center text-xs text-slate-400 font-bold">No accounts found.</CommandEmpty>
            <CommandGroup className="w-full">
              {sortedAccounts.map((a) => (
                <CommandItem
                  key={a.id}
                  value={`${a.code} ${a.name}`}
                  onSelect={() => {
                    onChange(a.id)
                    setOpen(false)
                  }}
                  className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-slate-50 transition-colors text-slate-700 font-semibold text-xs"
                >
                  <span className="truncate flex items-center">
                    <span className="font-mono text-[9px] text-slate-400 mr-2 bg-slate-100 px-1.5 py-0.5 rounded-md shrink-0">{a.code}</span>
                    <span className="truncate">{a.name}</span>
                    <span className="text-[9px] text-muted-foreground font-normal ml-1.5 shrink-0">({a.type})</span>
                  </span>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4 text-indigo-600 shrink-0",
                      value === a.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
