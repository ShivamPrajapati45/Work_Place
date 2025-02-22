import { professionOptions } from '@/utils/categories'
import React from 'react'
import { Command,CommandEmpty,CommandGroup,CommandInput,CommandItem,CommandList } from '@/components/ui/command';
import { Popover,PopoverContent,PopoverTrigger } from '@/components/ui/popover';
import { Button } from '../ui/button';
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from '@/lib/utils';



const ProfessionSelect = ({open,setOpen,profession,setProfession}) => {
    return (
            <Popover open={open} onOpenChange={setOpen} >
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[350px] justify-between"
                        >
                        {profession
                            ? professionOptions.find((item) => item.label === profession)?.label
                            : "Select profession..."}
                        <ChevronsUpDown className="opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] h-[300px] p-2">
                        <Command>
                            <CommandInput placeholder="Search profession..." className="h-9"/>
                            <CommandList>
                                <CommandEmpty>No Profession found.</CommandEmpty>
                                <CommandGroup>
                                    {professionOptions.map((item, index) => (
                                        <CommandItem
                                            key={item.value}
                                            value={item.value}
                                            onSelect={() => {
                                                setProfession(item.label)
                                                setOpen(false)
                                            }}
                                            className='text-black'
                                        >
                                            {item.label}
                                            <Check
                                                className={cn(
                                                    "ml-auto text-black",
                                                    profession === item.value ? "opacity-100  text-black" : "opacity-0 text-black"
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

export default ProfessionSelect