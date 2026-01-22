import { useEffect, useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
export class QueryBuilder {
  private queryObject: Record<string, any>;

  constructor() {
    this.queryObject = {};
  }

  /**
   
   * @param fieldName - The name of the field to add.
   * @param value - The value of the field.
   */
  addField(fieldName: string, value: any): void {
    if (value !== null && value !== undefined) {
      this.queryObject[fieldName] = value;
    }
  }

  /**
   * @returns The cleaned query object.
   */
  getQuery(): Record<string, any> {
    return Object.fromEntries(
      Object.entries(this.queryObject).filter(
        ([_, value]) => value !== null && value !== undefined
      )
    );
  }

  /**
   * @param fieldName - The name of the field to delete.
   */
  deleteField(fieldName: string): void {
    if (fieldName in this.queryObject) {
      delete this.queryObject[fieldName];
    }
  }

  /**
   * @returns The stringified query object.
   */
  toString(): string {
    return JSON.stringify(this.getQuery());
  }
}

const useQueryBuilder = () => {
  const [queryBuilder] = useState(() => new QueryBuilder());
  const [query, setQuery] = useState<Record<string, any>>({});

  useEffect(() => {
    setQuery(queryBuilder.getQuery());
  }, [queryBuilder]);

  const addField = (fieldName: string, value: any) => {
    queryBuilder.addField(fieldName, value);
    setQuery(queryBuilder.getQuery());
  };

  const deleteField = (fieldName: string) => {
    queryBuilder.deleteField(fieldName);
    setQuery(queryBuilder.getQuery());
  };

  return { query, addField, deleteField };
};

export default useQueryBuilder;
