import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils";

type Props = {
  coloumnIndex: number;
  selectedColumns: Record<string, string | null>;
  onChange: (columnIndex: number, value: string | null) => void;
};

const options = [
    "amount",
    "payee",
    "notes",
    "date",
]

const TableHeadSelect = ({
    coloumnIndex,
    selectedColumns,
    onChange,
}: Props) => {
  const currentSelction = selectedColumns[`column_${coloumnIndex}`]
  return (
    <Select
      value={currentSelction || ""}
      onValueChange={(value) => onChange(coloumnIndex, value)}
    >
      <SelectTrigger
        className={cn(
          "focus:ring-offset-0 focus:ring-transparent outline-none border-none bg-transparent capitalize",
          currentSelction && "text-blue-500"
        )}
      >
      <SelectValue placeholder="Skip" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="skip">Skip</SelectItem>
        {options.map((option, index) => {
          const disabled = Object.values(selectedColumns).includes(option) && selectedColumns[`column_${coloumnIndex}`] !== option;
          return (
          <SelectItem key={index} value={option} disabled={disabled}>
            {option}
          </SelectItem>
        )})}
      </SelectContent>
    </Select>
  )
}

export default TableHeadSelect