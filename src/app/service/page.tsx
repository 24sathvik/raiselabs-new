"use client"

import { motion } from "framer-motion"
import { Upload, Send, X } from "lucide-react"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useState, useRef } from "react"
import emailjs from "@emailjs/browser"
import { toast } from "sonner"

export default function ServicePage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setSelectedFiles(prev => [...prev, ...filesArray])
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!formRef.current) return

    // Convert selected files to readable names (EmailJS safe)
    const attachmentsValue =
      selectedFiles.length > 0
        ? selectedFiles.map(file => file.name).join(", ")
        : "No attachments provided"

    try {
      await emailjs.sendForm(
        "service_aq575d6",
        "template_2430i4s",
        formRef.current,
        "IA05B7yLdhWxszPJd"
      )

      toast.success(
        "Service request submitted successfully. Our team will contact you within 24 hours."
      )

      formRef.current.reset()
      setSelectedFiles([])
    } catch (error) {
      console.error("EmailJS Error:", error)
      toast.error("Failed to submit service request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Navigation />

      <main className="pt-16 lg:pt-20">
        {/* Hero Section */}
        <section className="py-20 lg:py-32 bg-gradient-to-br from-[#1a1f3a]/5 via-background to-[#7F9DB1]/5">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6">
                Service Request
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
                Need assistance with your Raise Lab equipment? Submit a service request and our expert team will get back to you within 24 hours.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Service Request Form */}
        <section className="py-12 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-card p-8 lg:p-12 rounded-2xl border border-[#7F9DB1]/20 shadow-xl"
              >
                <form
                  ref={formRef}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label className="text-base">Full Name *</Label>
                    <Input
                      name="full_name"
                      placeholder="John Doe"
                      required
                      className="border-[#7F9DB1]/30 focus:border-[#7F9DB1]"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label className="text-base">Email Address *</Label>
                    <Input
                      name="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      required
                      className="border-[#7F9DB1]/30 focus:border-[#7F9DB1]"
                    />
                  </div>

                  {/* Product / Equipment */}
                  <div className="space-y-2">
                    <Label className="text-base">
                      Product ID / Equipment Name *
                    </Label>
                    <Input
                      name="product_equipment"
                      placeholder="e.g., RPHT-1P, Hardness Tester"
                      required
                      className="border-[#7F9DB1]/30 focus:border-[#7F9DB1]"
                    />
                  </div>

                  {/* Issue Description */}
                  <div className="space-y-2">
                    <Label className="text-base">
                      Describe Your Query / Issue *
                    </Label>
                    <Textarea
                      name="issue_description"
                      rows={8}
                      placeholder="Please provide detailed information about your service request..."
                      required
                      className="border-[#7F9DB1]/30 focus:border-[#7F9DB1] resize-none"
                    />
                  </div>

                  {/* Hidden Attachments Field */}
                  <input
                    type="hidden"
                    name="attachments"
                    value={
                      selectedFiles.length > 0
                        ? selectedFiles.map(file => file.name).join(", ")
                        : "No attachments provided"
                    }
                  />

                  {/* File Upload UI (unchanged) */}
                  <div className="space-y-2">
                    <Label className="text-base">
                      Upload Images or Videos (Optional)
                    </Label>

                    <div className="border-2 border-dashed border-[#7F9DB1]/30 rounded-xl p-6">
                      <input
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="fileUpload"
                      />
                      <label htmlFor="fileUpload" className="cursor-pointer">
                        <div className="flex flex-col items-center text-center">
                          <Upload className="h-8 w-8 text-[#7F9DB1] mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload files
                          </p>
                        </div>
                      </label>
                    </div>

                    {selectedFiles.length > 0 && (
                      <div className="space-y-2">
                        {selectedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-2 bg-muted rounded-md"
                          >
                            <span className="text-sm truncate">
                              {file.name}
                            </span>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => removeFile(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-[#1a1f3a] text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Submit Service Request
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
