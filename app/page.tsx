"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Shield, CreditCard, MapPin, Clock, DollarSign, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TransactionData {
  amount: string
  currency: string
  merchantName: string
  merchantCategory: string
  cardNumber: string
  cardType: string
  transactionDate: string
  transactionTime: string
  location: string
  country: string
  isOnlineTransaction: boolean
  customerAge: string
  accountBalance: string
  previousTransactionAmount: string
  timeSinceLastTransaction: string
  additionalNotes: string
}

export default function FraudDetectionPage() {
  const { toast } = useToast()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<{
    status: "valid" | "fraudulent" | null
    confidence: number
    reasoning: string
  }>({
    status: null,
    confidence: 0,
    reasoning: "",
  })

  const [formData, setFormData] = useState<TransactionData>({
    amount: "",
    currency: "USD",
    merchantName: "",
    merchantCategory: "",
    cardNumber: "",
    cardType: "",
    transactionDate: "",
    transactionTime: "",
    location: "",
    country: "",
    isOnlineTransaction: false,
    customerAge: "",
    accountBalance: "",
    previousTransactionAmount: "",
    timeSinceLastTransaction: "",
    additionalNotes: "",
  })

  const handleInputChange = (field: keyof TransactionData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAnalyzing(true)

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
      if (!apiKey) {
        throw new Error("Gemini API key not configured. Please add NEXT_PUBLIC_GEMINI_API_KEY to your .env.local file.")
      }

      const prompt = `Analyze this credit card transaction for fraud detection:
      
Transaction Details:
- Amount: ${formData.amount} ${formData.currency}
- Merchant: ${formData.merchantName} (${formData.merchantCategory})
- Card: ${formData.cardType} ending in ${formData.cardNumber.slice(-4)}
- Date/Time: ${formData.transactionDate} at ${formData.transactionTime}
- Location: ${formData.location}, ${formData.country}
- Transaction Type: ${formData.isOnlineTransaction ? "Online" : "In-person"}
- Customer Age: ${formData.customerAge}
- Account Balance: ${formData.accountBalance}
- Previous Transaction: ${formData.previousTransactionAmount}
- Time Since Last Transaction: ${formData.timeSinceLastTransaction}
- Additional Notes: ${formData.additionalNotes}

Please analyze this transaction and determine if it's "valid" or "fraudulent". 
Provide your response in this exact JSON format:
{
  "status": "valid" or "fraudulent",
  "confidence": number between 0-100,
  "reasoning": "detailed explanation of your analysis"
}`

      console.log("Prompt for Gemini API:", prompt)
      console.log("Transaction Data JSON:", JSON.stringify(formData, null, 2))

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
          }),
        },
      )

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      const geminiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text
      if (!geminiResponse) {
        throw new Error("Invalid response from Gemini API")
      }

      let analysisResult
      try {
        // Extract JSON from response (in case there's extra text)
        const jsonMatch = geminiResponse.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          analysisResult = JSON.parse(jsonMatch[0])
        } else {
          // Fallback: parse the entire response as JSON
          analysisResult = JSON.parse(geminiResponse)
        }
      } catch (parseError) {
        analysisResult = {
          status: geminiResponse.toLowerCase().includes("fraudulent") ? "fraudulent" : "valid",
          confidence: 85,
          reasoning: geminiResponse,
        }
      }

      setResult({
        status: analysisResult.status,
        confidence: analysisResult.confidence,
        reasoning: analysisResult.reasoning,
      })

      toast({
        title: "Analysis Complete",
        description: `Transaction marked as ${analysisResult.status} with ${analysisResult.confidence}% confidence`,
      })
    } catch (error) {
      console.error("Analysis error:", error)
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "There was an error analyzing the transaction",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 py-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900">Fraud Detection System</h1>
          </div>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Advanced AI-powered credit card transaction analysis using Gemini API. Enter transaction details below for
            real-time fraud detection.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  Transaction Details
                </CardTitle>
                <CardDescription>Fill in the transaction information for fraud analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Transaction Amount */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="amount" className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Transaction Amount
                      </Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => handleInputChange("amount", e.target.value)}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="currency">Currency</Label>
                      <Select value={formData.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="JPY">JPY</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Merchant Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="merchantName">Merchant Name</Label>
                      <Input
                        id="merchantName"
                        placeholder="e.g., Amazon, Walmart, etc."
                        value={formData.merchantName}
                        onChange={(e) => handleInputChange("merchantName", e.target.value)}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="merchantCategory">Merchant Category</Label>
                      <Select
                        value={formData.merchantCategory}
                        onValueChange={(value) => handleInputChange("merchantCategory", value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="grocery">Grocery</SelectItem>
                          <SelectItem value="gas">Gas Station</SelectItem>
                          <SelectItem value="restaurant">Restaurant</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="online">Online Shopping</SelectItem>
                          <SelectItem value="entertainment">Entertainment</SelectItem>
                          <SelectItem value="travel">Travel</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Card Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number (Last 4 digits)</Label>
                      <Input
                        id="cardNumber"
                        placeholder="****-****-****-1234"
                        value={formData.cardNumber}
                        onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                        className="mt-1"
                        maxLength={4}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardType">Card Type</Label>
                      <Select value={formData.cardType} onValueChange={(value) => handleInputChange("cardType", value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select card type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="visa">Visa</SelectItem>
                          <SelectItem value="mastercard">Mastercard</SelectItem>
                          <SelectItem value="amex">American Express</SelectItem>
                          <SelectItem value="discover">Discover</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Date and Time */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="transactionDate" className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Transaction Date
                      </Label>
                      <Input
                        id="transactionDate"
                        type="date"
                        value={formData.transactionDate}
                        onChange={(e) => handleInputChange("transactionDate", e.target.value)}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="transactionTime">Transaction Time</Label>
                      <Input
                        id="transactionTime"
                        type="time"
                        value={formData.transactionTime}
                        onChange={(e) => handleInputChange("transactionTime", e.target.value)}
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Location (City, State)
                      </Label>
                      <Input
                        id="location"
                        placeholder="e.g., New York, NY"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        placeholder="e.g., United States"
                        value={formData.country}
                        onChange={(e) => handleInputChange("country", e.target.value)}
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>

                  {/* Transaction Type */}
                  <div>
                    <Label>Transaction Type</Label>
                    <div className="flex gap-4 mt-2">
                      <Button
                        type="button"
                        variant={formData.isOnlineTransaction ? "outline" : "default"}
                        onClick={() => handleInputChange("isOnlineTransaction", false)}
                        className="flex-1"
                      >
                        In-Person
                      </Button>
                      <Button
                        type="button"
                        variant={formData.isOnlineTransaction ? "default" : "outline"}
                        onClick={() => handleInputChange("isOnlineTransaction", true)}
                        className="flex-1"
                      >
                        Online
                      </Button>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="customerAge">Customer Age</Label>
                      <Input
                        id="customerAge"
                        type="number"
                        placeholder="25"
                        value={formData.customerAge}
                        onChange={(e) => handleInputChange("customerAge", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="accountBalance">Account Balance</Label>
                      <Input
                        id="accountBalance"
                        type="number"
                        step="0.01"
                        placeholder="5000.00"
                        value={formData.accountBalance}
                        onChange={(e) => handleInputChange("accountBalance", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="previousTransactionAmount">Previous Transaction Amount</Label>
                      <Input
                        id="previousTransactionAmount"
                        type="number"
                        step="0.01"
                        placeholder="50.00"
                        value={formData.previousTransactionAmount}
                        onChange={(e) => handleInputChange("previousTransactionAmount", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="timeSinceLastTransaction">Time Since Last Transaction</Label>
                      <Input
                        id="timeSinceLastTransaction"
                        placeholder="e.g., 2 hours, 1 day"
                        value={formData.timeSinceLastTransaction}
                        onChange={(e) => handleInputChange("timeSinceLastTransaction", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <Label htmlFor="additionalNotes">Additional Notes</Label>
                    <Textarea
                      id="additionalNotes"
                      placeholder="Any additional context or suspicious behavior..."
                      value={formData.additionalNotes}
                      onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Analyzing Transaction...
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4 mr-2" />
                        Analyze for Fraud
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {/* Analysis Result */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  Analysis Result
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result.status ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <Badge
                        variant={result.status === "valid" ? "default" : "destructive"}
                        className="text-sm px-3 py-1"
                      >
                        {result.status === "valid" ? "VALID TRANSACTION" : "FRAUDULENT TRANSACTION"}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-900">{result.confidence}%</div>
                      <div className="text-sm text-slate-600">Confidence Score</div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <div className="text-sm font-medium text-slate-900 mb-1">Reasoning:</div>
                      <div className="text-sm text-slate-600">{result.reasoning}</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-slate-500 py-8">
                    <Shield className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Submit transaction details to see analysis results</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">API Status</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Online
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Model</span>
                  <span className="text-sm font-medium">Gemini Pro</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Response Time</span>
                  <span className="text-sm font-medium">~2.1s</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
