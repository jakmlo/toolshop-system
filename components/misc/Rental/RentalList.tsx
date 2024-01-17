import { Tool } from "@prisma/client";

type RentalListProps = {
  tools: Tool[];
  catalogNumberCount: {
    [key: string]: number;
  };
};

export default function RentalList({
  tools,
  catalogNumberCount,
}: RentalListProps) {
  return (
    <div className="bg-slate-200 w-4/5 mx-16 p-8 rounded-md">
      <ul>
        {Object.keys(catalogNumberCount).map((catalogNumber, index) => {
          const matchedTool = tools.find(
            (tool) => tool.catalogNumber === catalogNumber
          );
          const occurrences = catalogNumberCount[catalogNumber];

          return (
            <li key={index}>
              <p>
                {matchedTool
                  ? `${matchedTool.name} ${catalogNumber}`
                  : "Tool not found"}{" "}
                ({occurrences})
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
