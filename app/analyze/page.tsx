"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { 
  ArrowLeft, 
  ArrowRight, 
  Building2, 
  FileText, 
  Loader2,
  Upload,
  CheckCircle2
} from "lucide-react"

const analysisSchema = z.object({
  // Step 1: Property Details
  propertyAddress: z.string().min(5, "Please enter a valid address"),
  propertyPostcode: z.string().min(3, "Please enter a valid postcode"),
  purchasePrice: z.number().min(1000, "Purchase price must be at least £1,000"),
  
  // Step 2: Property Type & Condition
  propertyType: z.enum(["residential", "commercial", "office", "care_home", "mixed_use"]),
  currentCondition: z.enum(["operational", "vacant", "needs_renovation", "derelict"]),
  propertySize: z.union([z.number(), z.nan()]).optional().transform(val => isNaN(val as number) ? undefined : val),
  numberOfUnits: z.union([z.number(), z.nan()]).optional().transform(val => isNaN(val as number) ? undefined : val),
  
  // Step 3: Development Goals
  reportType: z.enum(["basic", "professional", "development"]),
  developmentGoals: z.array(z.string()).min(1, "Please select at least one development goal"),
  additionalNotes: z.string().optional(),
  
  // Step 4: File Uploads
  files: z.array(z.any()).optional(),
})

type AnalysisFormData = z.infer<typeof analysisSchema>

const steps = [
  { id: 1, name: "Property Details", icon: Building2 },
  { id: 2, name: "Type & Condition", icon: FileText },
  { id: 3, name: "Development Goals", icon: CheckCircle2 },
  { id: 4, name: "Upload Files", icon: Upload },
]

const propertyTypes = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "office", label: "Office Building" },
  { value: "care_home", label: "Care Home" },
  { value: "mixed_use", label: "Mixed Use" },
]

const propertyConditions = [
  { value: "operational", label: "Operational" },
  { value: "vacant", label: "Vacant" },
  { value: "needs_renovation", label: "Needs Renovation" },
  { value: "derelict", label: "Derelict" },
]

const developmentOptions = [
  { value: "hmo", label: "HMO Conversion" },
  { value: "apartments", label: "Apartment Development" },
  { value: "flip", label: "Renovate & Flip" },
  { value: "btl", label: "Buy to Let" },
  { value: "commercial_residential", label: "Commercial to Residential" },
  { value: "serviced", label: "Serviced Accommodation" },
  { value: "care_facility", label: "Care Facility" },
  { value: "student", label: "Student Accommodation" },
]

export default function AnalyzePage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<AnalysisFormData>({
    resolver: zodResolver(analysisSchema),
    defaultValues: {
      developmentGoals: [],
      reportType: "professional",
    },
  })

  // Log validation errors
  if (Object.keys(errors).length > 0) {
    console.log("Form validation errors:", errors)
  }

  const selectedGoals = watch("developmentGoals") || []
  const reportType = watch("reportType")

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setUploadedFiles(prev => [...prev, ...files])
    setValue("files", [...uploadedFiles, ...files])
  }

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index)
    setUploadedFiles(newFiles)
    setValue("files", newFiles)
  }

  const toggleGoal = (goal: string) => {
    const current = selectedGoals || []
    const updated = current.includes(goal)
      ? current.filter(g => g !== goal)
      : [...current, goal]
    setValue("developmentGoals", updated)
  }

  const validateStep = async (step: number) => {
    switch (step) {
      case 1:
        return await trigger(["propertyAddress", "propertyPostcode", "purchasePrice"])
      case 2:
        return await trigger(["propertyType", "currentCondition"])
      case 3:
        return await trigger(["reportType", "developmentGoals"])
      case 4:
        return true
      default:
        return false
    }
  }

  const handleNext = async () => {
    const isValid = await validateStep(currentStep)
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = async (data: AnalysisFormData) => {
    console.log("Form submitted with data:", data)
    
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "Please sign in to create an analysis",
        variant: "destructive",
      })
      router.push("/auth/signin")
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      
      // Add all form fields
      Object.entries(data).forEach(([key, value]) => {
        if (key === "files") return
        if (Array.isArray(value)) {
          value.forEach(v => formData.append(`${key}[]`, v))
        } else if (value !== undefined && value !== null) {
          formData.append(key, value.toString())
        }
      })

      // Add files
      uploadedFiles.forEach(file => {
        formData.append("files", file)
      })

      const response = await fetch("/api/analyze/create", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        console.error("API Error:", result)
        toast({
          title: "Error",
          description: result.error || "Failed to create analysis. Please try again.",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success!",
        description: "Your property analysis is being processed. We'll notify you when it's ready.",
      })

      router.push(`/dashboard/reports/${result.reportId}`)
    } catch (error) {
      console.error("Form submission error:", error)
      toast({
        title: "Error",
        description: "Failed to create analysis. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const progressValue = (currentStep / steps.length) * 100

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">New Property Analysis</h1>
        <p className="text-muted-foreground">
          Complete the form below to generate your comprehensive property investment report
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <Progress value={progressValue} className="mb-4" />
        <div className="flex justify-between">
          {steps.map((step) => {
            const Icon = step.icon
            const isActive = step.id === currentStep
            const isCompleted = step.id < currentStep
            
            return (
              <div
                key={step.id}
                className={`flex items-center gap-2 text-sm ${
                  isActive ? "text-primary font-medium" : 
                  isCompleted ? "text-muted-foreground" : 
                  "text-muted-foreground/50"
                }`}
              >
                <div className={`rounded-full p-1 ${
                  isActive ? "bg-primary text-primary-foreground" :
                  isCompleted ? "bg-primary/20 text-primary" :
                  "bg-muted"
                }`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="hidden sm:inline">{step.name}</span>
              </div>
            )
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="relative z-10">
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].name}</CardTitle>
            <CardDescription>
              {currentStep === 1 && "Enter the basic details about the property"}
              {currentStep === 2 && "Specify the property type and current condition"}
              {currentStep === 3 && "Select your development goals and report type"}
              {currentStep === 4 && "Upload floor plans, images, or other relevant documents"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Step 1: Property Details */}
            {currentStep === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="propertyAddress">Property Address</Label>
                  <Input
                    id="propertyAddress"
                    placeholder="123 Main Street, London"
                    {...register("propertyAddress")}
                  />
                  {errors.propertyAddress && (
                    <p className="text-sm text-destructive">{errors.propertyAddress.message}</p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="propertyPostcode">Postcode</Label>
                    <Input
                      id="propertyPostcode"
                      placeholder="SW1A 1AA"
                      {...register("propertyPostcode")}
                    />
                    {errors.propertyPostcode && (
                      <p className="text-sm text-destructive">{errors.propertyPostcode.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="purchasePrice">Purchase Price (£)</Label>
                    <Input
                      id="purchasePrice"
                      type="number"
                      placeholder="500000"
                      {...register("purchasePrice", { valueAsNumber: true })}
                    />
                    {errors.purchasePrice && (
                      <p className="text-sm text-destructive">{errors.purchasePrice.message}</p>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Property Type & Condition */}
            {currentStep === 2 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="propertyType">Property Type</Label>
                  <Select
                    onValueChange={(value) => setValue("propertyType", value as any)}
                    defaultValue={watch("propertyType")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.propertyType && (
                    <p className="text-sm text-destructive">{errors.propertyType.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Current Condition</Label>
                  <RadioGroup
                    onValueChange={(value) => setValue("currentCondition", value as any)}
                    defaultValue={watch("currentCondition")}
                  >
                    {propertyConditions.map(condition => (
                      <div key={condition.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={condition.value} id={condition.value} />
                        <Label htmlFor={condition.value} className="font-normal cursor-pointer">
                          {condition.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {errors.currentCondition && (
                    <p className="text-sm text-destructive">{errors.currentCondition.message}</p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="propertySize">Property Size (sq ft) - Optional</Label>
                    <Input
                      id="propertySize"
                      type="number"
                      placeholder="2500"
                      {...register("propertySize", { valueAsNumber: true })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="numberOfUnits">Number of Units - Optional</Label>
                    <Input
                      id="numberOfUnits"
                      type="number"
                      placeholder="1"
                      {...register("numberOfUnits", { valueAsNumber: true })}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Step 3: Development Goals */}
            {currentStep === 3 && (
              <>
                <div className="space-y-2">
                  <Label>Report Type</Label>
                  <RadioGroup
                    onValueChange={(value) => setValue("reportType", value as any)}
                    defaultValue={reportType}
                  >
                    <div className="space-y-4">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="basic" id="basic" />
                        <div className="grid gap-1.5 leading-none">
                          <Label htmlFor="basic" className="font-medium cursor-pointer">
                            Basic Report (£49)
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Property overview, market analysis, single strategy
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="professional" id="professional" />
                        <div className="grid gap-1.5 leading-none">
                          <Label htmlFor="professional" className="font-medium cursor-pointer">
                            Professional Report (£149)
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Multiple strategies, detailed costs, cash flow projections
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="development" id="development" />
                        <div className="grid gap-1.5 leading-none">
                          <Label htmlFor="development" className="font-medium cursor-pointer">
                            Development Appraisal (£299)
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Construction timeline, financing options, phasing strategies
                          </p>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Development Goals</Label>
                  <p className="text-sm text-muted-foreground">
                    Select all strategies you'd like us to analyze
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {developmentOptions.map(option => (
                      <div
                        key={option.value}
                        className={`flex items-center space-x-2 rounded-lg border p-3 cursor-pointer transition-colors ${
                          selectedGoals.includes(option.value)
                            ? "border-primary bg-primary/5"
                            : "border-input hover:bg-accent/50"
                        }`}
                        onClick={() => toggleGoal(option.value)}
                      >
                        <div className={`h-4 w-4 rounded-sm border ${
                          selectedGoals.includes(option.value)
                            ? "border-primary bg-primary"
                            : "border-input"
                        }`}>
                          {selectedGoals.includes(option.value) && (
                            <CheckCircle2 className="h-3 w-3 text-primary-foreground" />
                          )}
                        </div>
                        <Label className="cursor-pointer font-normal">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {errors.developmentGoals && (
                    <p className="text-sm text-destructive">{errors.developmentGoals.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalNotes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="additionalNotes"
                    placeholder="Any specific requirements or information about the property..."
                    {...register("additionalNotes")}
                    rows={4}
                  />
                </div>
              </>
            )}

            {/* Step 4: File Uploads */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="files">Upload Files (Optional)</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload floor plans, property images, surveys, or other relevant documents
                  </p>
                  <Input
                    id="files"
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileUpload}
                    className="cursor-pointer"
                  />
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <Label>Uploaded Files</Label>
                    <div className="space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 border rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{file.name}</span>
                            <span className="text-xs text-muted-foreground">
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Card className="bg-muted/50">
                  <CardContent className="pt-6">
                    <h4 className="font-medium mb-2">Summary</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Property:</strong> {watch("propertyAddress")}</p>
                      <p><strong>Purchase Price:</strong> £{watch("purchasePrice")?.toLocaleString()}</p>
                      <p><strong>Type:</strong> {propertyTypes.find(t => t.value === watch("propertyType"))?.label}</p>
                      <p><strong>Report Type:</strong> {watch("reportType")}</p>
                      <p><strong>Strategies:</strong> {selectedGoals.length} selected</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={currentStep === 1 ? () => router.push("/dashboard") : handleBack}
              disabled={isSubmitting}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {currentStep === 1 ? "Cancel" : "Back"}
            </Button>

            {currentStep < steps.length ? (
              <Button type="button" onClick={handleNext} disabled={isSubmitting}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                type="button" 
                disabled={isSubmitting}
                onClick={() => {
                  console.log("Button clicked!")
                  console.log("Current form data:", watch())
                  console.log("Form errors:", errors)
                  handleSubmit(onSubmit)()
                }}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Analysis
              </Button>
            )}
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}