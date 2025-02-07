import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { convertAmountIntoMilliunit } from '@/lib/utils';
import { format, parse } from 'date-fns';
import { useState } from 'react';
import { toast } from 'sonner';
import ImportTable from './import-table';

const dateFormat = 'yyyy-MM-dd HH:mm:ss';
const outputFormat = 'yyyy-MM-dd';

const requiredOptions = ['amount', 'date', 'payee', 'notes'];

interface SelectedColumnState {
  [key: string]: string | null;
}

type Props = {
  data: string[][];
  onCancel: () => void;
  onSubmit: (data: any) => void;
};

const ImportCard = ({ data, onCancel, onSubmit }: Props) => {
  const [selectedColumns, setSelectedColumns] = useState<SelectedColumnState>(
    {},
  );

  const headers = data[0];
  const body = data.slice(1);

  const onTableHeadSelectChange = (
    columnIndex: number,
    value: string | null,
  ) => {
    setSelectedColumns((prevState) => {
      const newState = { ...prevState };
      for (const key in newState) {
        if (newState[key] === value) {
          newState[key] = null;
        }
      }

      if (value === 'skip') {
        value = null;
      }

      newState[`column_${columnIndex}`] = value;
      return newState;
    });
  };

  const progress = Object.values(selectedColumns).filter(Boolean).length;

  const handleContinue = () => {
    try {
      const getColumnIndex = (column: string) => {
        return column.split('_')[1];
      };

      const mapData = {
        headers: headers.map((_header, index) => {
          const columnIndex = getColumnIndex(`column_${index}`);
          return selectedColumns[`column_${columnIndex}`] || null;
        }),
        body: body
          .map((row) => {
            const transformRow = row.map((cell, index) => {
              const columnIndex = getColumnIndex(`column_${index}`);
              return selectedColumns[`column_${columnIndex}`] ? cell : null;
            });

            return transformRow.every((item) => item === null)
              ? []
              : transformRow;
          })
          .filter((row) => row.length > 0),
      };

      const arrayOfData = mapData.body.map((row) => {
        return row.reduce((acc: any, cell, index) => {
          const header = mapData.headers[index];
          if (header !== null) {
            acc[header] = cell;
          }

          return acc;
        }, {});
      });

      const formatedData = arrayOfData.map((item) => ({
        ...item,
        amount: convertAmountIntoMilliunit(parseFloat(item.amount)),
        date: format(parse(item.date, dateFormat, new Date()), outputFormat),
      }));

      onSubmit(formatedData);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Card className="border-none drop-shadow-sm -mt-24">
      <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
        <CardTitle className="text-xl line-clamp-1">
          Import Transactions
        </CardTitle>
        <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
          <Button
            className="w-full lg:w-auto"
            onClick={onCancel}
            size="sm"
            variant={'destructive'}
          >
            Cancel
          </Button>
          <Button
            onClick={handleContinue}
            className="w-full lg:w-auto"
            size={'sm'}
            disabled={progress < requiredOptions.length}
          >
            Continue ({progress}/{requiredOptions.length})
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ImportTable
          headers={headers}
          body={body}
          selectedColumns={selectedColumns}
          onTableHeadSelectChange={onTableHeadSelectChange}
        />
      </CardContent>
    </Card>
  );
};

export default ImportCard;
