"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { User } from "next-auth"
import { Button } from "@/components/ui/button"

const Navbar = () => {


    const { data: session } = useSession()

    const user: User = session?.user


    return (
        <nav>
            <div>
                <a href="#"> Mystry Message</a>
                {
                    session ? (
                        <>
                            <span>Welcome , {user.username || user.email}
                            </span>
                            <Button onClick={() => signOut()}>Logout</Button>
                        </>
                    ) : (
                        <link href="/sign-in">Log-in</link>
                    )
                }
            </div>
        </nav>

    )
}

export default Navbar