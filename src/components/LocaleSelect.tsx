"use client";
import { useChangeLocale, useCurrentLocale } from "../../locales/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { ComponentProps } from "react";

const languageOptions = [
  {
    value: "en",
    label: "English",
    flag: "/flags/gb.webp",
  },
  {
    value: "fr",
    label: "Français",
    flag: "/flags/fr.webp",
  },
  {
    value: "de",
    label: "Deutsch",
    flag: "/flags/de.webp",
  },
  {
    value: "es",
    label: "Español",
    flag: "/flags/es.webp",
  },
  {
    value: "pt",
    label: "Português",
    flag: "/flags/pt.webp",
  },
];

type LocaleSelectProps = ComponentProps<typeof Select> & {
  className?: string;
  triggerClassName?: string;
};

export const LocaleSelect = ({
  className,
  triggerClassName,
  ...props
}: LocaleSelectProps) => {
  const locale = useCurrentLocale();
  const changeLocale = useChangeLocale();

  const currentLanguage = languageOptions.find((lang) => lang.value === locale);

  return (
    <Select
      value={locale}
      onValueChange={(value) =>
        changeLocale(value as "fr" | "en" | "de" | "es" | "pt")
      }
      {...props}
    >
      <SelectTrigger className={`w-[150px] gap-2 ${triggerClassName}`}>
        {currentLanguage && (
          <Image
            src={currentLanguage.flag}
            alt={currentLanguage.label}
            width={20}
            height={20}
            className="h-4 w-4"
          />
        )}
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent className={className}>
        {languageOptions.map((language) => (
          <SelectItem key={language.value} value={language.value}>
            <div className="flex items-center gap-2">
              <Image
                src={language.flag}
                alt={language.label}
                width={20}
                height={20}
                className="h-4 w-4"
              />
              <span>{language.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};