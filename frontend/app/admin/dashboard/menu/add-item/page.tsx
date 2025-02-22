"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Minus } from "lucide-react"

export default function AddItemPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    category: "",
    sub_category: "",
    tax: "",
    packaging_charge: "",
    variations: [{ key: "", value: "" }],
  })
  const [imageFile, setImageFile] = useState<File | null>(null)

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

  const addVariation = () => {
    setFormData((prev) => ({
      ...prev,
      variations: [...prev.variations, { key: "", value: "" }],
    }))
  }

  const removeVariation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      variations: prev.variations.filter((_, i) => i !== index),
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setImageFile(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    let finalImage = formData.imageUrl;
  
    if (imageFile) {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onloadend = async () => {
        finalImage = reader.result as string;
        await submitForm(finalImage);
      };
    } else {
      await submitForm(finalImage);
    }
  };
  
  const submitForm = async (imageUrl: string) => {
    const formattedVariations = formData.variations.reduce((acc, variation) => {
      if (variation.key && variation.value) {
        acc[variation.key] = parseFloat(variation.value);
      }
      return acc;
    }, {} as Record<string, number>);
  
    const payload = {
      name: formData.name,
      category: formData.category,
      sub_category: formData.sub_category,
      tax_percentage: parseFloat(formData.tax),
      packaging_charge: parseFloat(formData.packaging_charge),
      description: formData.description,
      variations: formattedVariations,
      image_url: imageUrl,
    };
  
    try {
      const response = await fetch("http://localhost:8000/api/menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.detail || "Failed to add menu item");
      }
  
      console.log("Success:", data);
      router.push("/menu");
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

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

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Image (Optional)</h3>
            <Input
              name="imageUrl"
              placeholder="Image URL"
              value={formData.imageUrl}
              onChange={handleInputChange}
            />
            <p className="text-sm text-gray-500">OR</p>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          <Select name="category" onValueChange={(value) => handleSelectChange("category", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="snacks">Snacks</SelectItem>
              <SelectItem value="beverages">Beverages</SelectItem>
              <SelectItem value="desserts">Desserts</SelectItem>
            </SelectContent>
          </Select>
          <Input name="sub_category" placeholder="Sub-Category" value={formData.sub_category} onChange={handleInputChange} />
          <Input name="tax" type="number" step="0.01" placeholder="Tax" value={formData.tax} onChange={handleInputChange} required />
          <Input name="packaging_charge" type="number" step="0.01" placeholder="Packaging Charge" value={formData.packaging_charge} onChange={handleInputChange} required />

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Variations</h3>
            {formData.variations.map((variation, index) => (
              <div key={index} className="flex space-x-2">
                <Input
                  placeholder="Size (e.g., Small, Medium, Large)"
                  value={variation.key}
                  onChange={(e) => handleVariationChange(index, "key", e.target.value)}
                />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={variation.value}
                  onChange={(e) => handleVariationChange(index, "value", e.target.value)}
                />
                <Button type="button" variant="outline" size="icon" onClick={() => removeVariation(index)}>
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addVariation}>
              <Plus className="h-4 w-4 mr-2" /> Add Variation
            </Button>
          </div>

          <Button type="submit">Add Item</Button>
        </form>
      </CardContent>
    </Card>
  )
}