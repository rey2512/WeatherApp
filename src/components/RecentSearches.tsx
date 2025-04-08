
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Clock, Trash2, History } from "lucide-react";
import { RecentSearch } from "../types/types";
import { formatDistanceToNow } from "date-fns";

interface RecentSearchesProps {
  searches: RecentSearch[];
  onSelectSearch: (city: string) => void;
  onClearSearches: () => void;
  onRemoveSearch: (id: string) => void;
}

export default function RecentSearches({
  searches,
  onSelectSearch,
  onClearSearches,
  onRemoveSearch,
}: RecentSearchesProps) {
  if (!searches || searches.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center">
          <History size={18} className="mr-2" />
          Recent Searches
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSearches}
          className="h-8 px-2 text-muted-foreground hover:text-destructive"
        >
          <Trash2 size={16} className="mr-1" />
          Clear All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {searches.map((search) => (
            <div
              key={search.id}
              className="flex items-center bg-secondary hover:bg-secondary/80 rounded-full pl-3 pr-2 py-1 transition-colors"
            >
              <span
                className="cursor-pointer"
                onClick={() => onSelectSearch(`${search.city}, ${search.country}`)}
              >
                {search.city}, {search.country}
                <span className="text-xs text-muted-foreground ml-1">
                  ({formatDistanceToNow(search.timestamp, { addSuffix: true })})
                </span>
              </span>
              <button
                onClick={() => onRemoveSearch(search.id)}
                className="ml-1 p-1 rounded-full hover:bg-secondary/90 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
