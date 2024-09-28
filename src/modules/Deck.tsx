import { Benefits } from '@/components/Benefits/Benefits'
import { CTA } from '@/components/CTA'
import { Explanation } from '@/components/Explanation'
import { Features } from '@/components/Features'
import { Hero } from '@/components/Hero'
import { Testimonials } from '@/components/Testimonials'
import { supabase } from '@/shared/supabase'
import { SchemaType } from '@/shared/types'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

import styles from './deck.module.css'

export const Deck = () => {
    const router = useRouter()
    const [deck, setDeck] = useState<SchemaType | null>(null)

    const fetchData = async () => {
        if (!router.isReady) {
            return
        }

        const { data: { data }, error } = await supabase
            .from("decks")
            .select("*")
            .eq("uuid", router.query.id)
            .maybeSingle()

        if (error) {
            console.error("Error fetching data:", error)
        } else {
            console.log("Data:", data)

            setDeck({
                color: data.color,
                logoURL: "https://i.ibb.co/WBVCmzZ/SUNDAI-logo.png", // @ts-expect-error
                list: data.list.map((item) => {
                    return {
                        ...item,
                        component: {
                            ...item,
                            logoURL: "https://i.ibb.co/WBVCmzZ/SUNDAI-logo.png",
                            color: data.color,
                        },
                    }
                }),
            })
        }
    }

    useEffect(() => {
        fetchData()
    }, [router.isReady])

    return (
        <div className={styles.root}>
            <div className={styles.container}>
                {deck?.list.map((item) => {
                    switch (item.type) {
                        case "HERO":
                            return <Hero {...item.component} {...item} />
                        case "CTA":
                            return <CTA {...item.component} {...item} />
                        case "BENEFITS":
                            return <Benefits {...item.component} {...item} />
                        case "EXPLANATION":
                            return <Explanation {...item.component} {...item} />
                        case "FEATURES":
                            return <Features {...item.component} {...item} />
                        case "TESTIMONIALS":
                            return (
                                <Testimonials {...item.component} {...item} />
                            )
                    }
                })}
            </div>
        </div>
    )
}

