// components/shared/CustomUpload.tsx
"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Control } from "react-hook-form";
import { RegisterFormData } from "@/app/schemas/registerSchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";

interface CustomUploadProps {
  control: Control<RegisterFormData>;
  name: "avatar";
  label: string;
}

export function CustomUpload({ control, name, label }: CustomUploadProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Dropzone onUpload={onChange} value={value} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface DropzoneProps {
  onUpload: (file: File) => void;
  value?: File;
}

function Dropzone({ onUpload, value }: DropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        onUpload(file);
      }
      console.log(file);
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxFiles: 1,
  });

  return (
    <Card
      {...getRootProps()}
      className="border-dashed border-2 rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50"
    >
      <input {...getInputProps()} />
      {value ? (
        <div className="flex flex-col items-center">
          <Image
            src={URL.createObjectURL(value)}
            alt="Preview"
            className="w-20 h-20 object-cover rounded-full mb-2"
            onLoad={(e) => URL.revokeObjectURL(e.currentTarget.src)}
          />
          <p className="text-sm text-muted-foreground">
            Click or drag to replace
          </p>
        </div>
      ) : (
        <>
          <UploadCloud className="w-10 h-10 mx-auto text-muted-foreground" />
          <p className="mt-2">
            {isDragActive
              ? "Drop the file here..."
              : "Drag 'n' drop an image, or click to select"}
          </p>
        </>
      )}
    </Card>
  );
}
