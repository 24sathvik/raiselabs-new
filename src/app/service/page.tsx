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

const CLOUD_NAME = "dqygyq1pl"
const UPLOAD_PRESET = "raiselabs_service_upload"

export default function ServicePage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files))
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  // 🔹 Upload files to Cloudinary and return URLs
  const uploadToCloudinary = async (): Promise<string[]> => {
    const urls: string[] = []

    for (const file of selectedFiles) {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", UPLOAD_PRESET)

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
        {
          method: "POST",
          body: formData
        }
      )

      const data = await response.json()
      urls.push(data.secure_url)
    }

    return urls
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!formRef.current) return

    try {
      let attachmentLinks = "No attachments provided"

      // Upload files if any
      if (selectedFiles.length > 0) {
        const urls = await uploadToCloudinary()
        attachmentLinks = urls.join("\n")
      }

      // Inject URLs into hidden field for EmailJS
      const hiddenInput = formRef.current.querySelector(
        'input[name="attachments"]'
      ) as HTMLInputElement

      hiddenInput.value = attachmentLinks

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
      console.error("EmailJS / Cloudinary Error:", error)
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
              <motion.div className="bg-card p-8 lg:p-12 rounded-2xl border border-[#7F9DB1]/20 shadow-xl">
                <form
                  ref={formRef}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <Label>Full Name *</Label>
                    <Input name="full_name" required />
                  </div>

                  <div className="space-y-2">
                    <Label>Email Address *</Label>
                    <Input type="email" name="email" required />
                  </div>

                  <div className="space-y-2">
                    <Label>Product ID / Equipment Name *</Label>
                    <Input name="product_equipment" required />
                  </div>

                  <div className="space-y-2">
                    <Label>Describe Your Query / Issue *</Label>
                    <Textarea
                      name="issue_description"
                      rows={8}
                      required
                      className="resize-none"
                    />
                  </div>

                  {/* Hidden field for EmailJS */}
                  <input type="hidden" name="attachments" />

                  {/* File Upload */}
                  <div className="space-y-2">
                    <Label>Upload Images or Videos (Optional)</Label>

                    <div className="border-2 border-dashed rounded-xl p-6">
                      <input
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="fileUpload"
                      />
                      <label htmlFor="fileUpload" className="cursor-pointer">
                        <div className="flex flex-col items-center">
                          <Upload className="h-8 w-8 mb-2 text-[#7F9DB1]" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload files
                          </p>
                        </div>
                      </label>
                    </div>

                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-2 bg-muted rounded-md"
                      >
                        <span className="text-sm truncate">{file.name}</span>
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
