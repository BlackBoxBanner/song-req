"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Song } from "@prisma/client"

const songSchema = z.object({
    song: z.string().min(1, "Song name is required"),
});

type SongSchemaType = z.infer<typeof songSchema>;

type ChangeSongNameFormProps = {
    song: Song
}

export const ChangeSongNameForm = ({ song }: ChangeSongNameFormProps) => {
    const form = useForm<SongSchemaType>({
        resolver: zodResolver(songSchema),
        defaultValues: {
            song: song.title,
        },
    })

    function onSubmit(values: SongSchemaType) {
        console.log(values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="song"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Song name</FormLabel>
                            <FormControl>
                                <Input placeholder="Song name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}