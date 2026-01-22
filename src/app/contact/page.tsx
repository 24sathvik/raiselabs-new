"use client"

import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useState, useRef } from "react"
import { toast } from "sonner"
import emailjs from "@emailjs/browser"

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    details: ["info@raiselabequip.com", "sales@raiselabequip.com"],
    link: "mailto:info@raiselabequip.com"
  },
  {
    icon: Phone,
    title: "Phone",
    details: ["+91 9177770365", "+91 9177770516"],
    link: "tel:+919177770365"
  },
  {
    icon: MapPin,
    title: "Office",
    details: [
      "C-2, Industrial Park, Moula-Ali",
      "Medchal Malkajgiri Dist, Telangana 500040"
    ],
    link: "https://www.google.com/maps/search/?api=1&query=Moula+Ali+Industrial+Park+Hyderabad+Telangana"
  }
]

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!formRef.current) return

    try {
      await emailjs.sendForm(
        "service_aq575d6",      // Service ID
        "template_1jscfzo",     // Template ID
        formRef.current,
        "IA05B7yLdhWxszPJd"     // Public Key
      )

      toast.success("Message sent successfully! We'll get back to you soon.")
      formRef.current.reset()
    } catch (error) {
      console.error("EmailJS Error:", error)
      toast.error("Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Navigation />

      <main className="pt-16 lg:pt-20">
        {/* Hero Section */}
        <section className="py-20 lg:py-32 bg-gradient-to-br from-[#7F9DB1]/10 via-background to-background">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6">
                Get in Touch
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
                Have a question about our laboratory equipment? We're here to help you find the perfect solution.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-12 lg:py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
              {contactInfo.map((info, index) => {
                const Icon = info.icon
                return (
                  <motion.a
                    key={index}
                    href={info.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                    className="group bg-card p-8 rounded-2xl border border-[#7F9DB1]/20 shadow-lg hover:shadow-2xl hover:border-[#7F9DB1]/40 transition-all text-center"
                  >
                    <div className="h-14 w-14 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform bg-[#1a1f3a]">
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{info.title}</h3>
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-muted-foreground">
                        {detail}
                      </p>
                    ))}
                  </motion.a>
                )
              })}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-12 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <motion.div className="bg-card p-8 lg:p-12 rounded-2xl border border-[#7F9DB1]/20 shadow-xl">
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">

                  <div className="space-y-2">
                    <Label>First Name *</Label>
                    <Input name="first_name" required />
                  </div>

                  <div className="space-y-2">
                    <Label>Email *</Label>
                    <Input name="email" type="email" required />
                  </div>

                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input name="phone" type="tel" />
                  </div>

                  <div className="space-y-2">
                    <Label>Message *</Label>
                    <Textarea name="message" rows={6} required />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full text-white bg-[#1a1f3a]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
