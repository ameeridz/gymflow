export function getLocalDateKey(
  dateValue: Date | string,
) {
  const date =
    dateValue instanceof Date
      ? dateValue
      : new Date(dateValue);

  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0");
  const day = String(date.getDate()).padStart(
    2,
    "0",
  );

  return `${year}-${month}-${day}`;
}

export function getStartOfLocalWeek(
  dateValue: Date | string = new Date(),
) {
  const date =
    dateValue instanceof Date
      ? new Date(dateValue)
      : new Date(dateValue);

  const dayOfWeek = date.getDay();
  const daysSinceMonday =
    dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  date.setDate(
    date.getDate() - daysSinceMonday,
  );
  date.setHours(0, 0, 0, 0);

  return date;
}

export function getEndOfLocalWeek(
  dateValue: Date | string = new Date(),
) {
  const endOfWeek = getStartOfLocalWeek(
    dateValue,
  );

  endOfWeek.setDate(endOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return endOfWeek;
}

export function isDateWithinLocalWeek(
  dateValue: Date | string,
  referenceDate: Date | string = new Date(),
) {
  const date =
    dateValue instanceof Date
      ? dateValue
      : new Date(dateValue);

  const startOfWeek =
    getStartOfLocalWeek(referenceDate);
  const endOfWeek =
    getEndOfLocalWeek(referenceDate);

  return (
    date >= startOfWeek && date <= endOfWeek
  );
}

export function isSameLocalDate(
  firstValue: Date | string,
  secondValue: Date | string,
) {
  return (
    getLocalDateKey(firstValue) ===
    getLocalDateKey(secondValue)
  );
}
