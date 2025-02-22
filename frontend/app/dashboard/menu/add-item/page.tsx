"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AddItemPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    category: "",
    sub_category: "",
    tax: "",
    packaging_charge: "",
    SKU: "",
    product_cost: "",
    variations: [{ name: "Regular", price: "" }],
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleVariationChange = (index: number, field: string, value: string) => {
    const newVariations = [...formData.variations]
    newVariations[index] = { ...newVariations[index], [field]: value }
    setFormData((prev) => ({ ...prev, variations: newVariations }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log(formData)
    router.push("/menu")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Menu Item</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="name" placeholder="Item Name" value={formData.name} onChange={handleInputChange} required />
          <Textarea
            name="description"
            placeholder="Description (Optional)"
            value={formData.description}
            onChange={handleInputChange}
          />
          <Input name="image" placeholder="Image URL (Optional)" value={formData.image} onChange={handleInputChange} />
          <Select name="category" onValueChange={(value) => handleSelectChange("category", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="main_course">Main Course</SelectItem>
              <SelectItem value="appetizer">Appetizer</SelectItem>
              <SelectItem value="dessert">Dessert</SelectItem>
            </SelectContent>
          </Select>
          <Input
            name="sub_category"
            placeholder="Sub-Category"
            value={formData.sub_category}
            onChange={handleInputChange}
          />
          <Input
            name="tax"
            type="number"
            step="0.01"
            placeholder="Tax"
            value={formData.tax}
            onChange={handleInputChange}
            required
          />
          <Input
            name="packaging_charge"
            type="number"
            step="0.01"
            placeholder="Packaging Charge"
            value={formData.packaging_charge}
            onChange={handleInputChange}
            required
          />
          <Input name="SKU" placeholder="SKU" value={formData.SKU} onChange={handleInputChange} required />
          <Input
            name="product_cost"
            type="number"
            step="0.01"
            placeholder="Product Cost"
            value={formData.product_cost}
            onChange={handleInputChange}
            required
          />
          {formData.variations.map((variation, index) => (
            <div key={index} className="flex space-x-2">
              <Input
                placeholder="Variation Name"
                value={variation.name}
                onChange={(e) => handleVariationChange(index, "name", e.target.value)}
              />
              <Input
                type="number"
                step="0.01"
                placeholder="Price"
                value={variation.price}
                onChange={(e) => handleVariationChange(index, "price", e.target.value)}
              />
            </div>
          ))}
          <Button type="submit">Add Item</Button>
        </form>
      </CardContent>
    </Card>
  )
}

