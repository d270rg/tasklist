import Link from "next/link";

export function PageNavigation({
  pageAmount,
  current,
}: {
  pageAmount: number;
  current: number;
}) {
  const navElements = [];

  for (let i = 1; i <= pageAmount; i++) {
    if (i === current) {
      navElements.push(
        <div key={`${i}`} className="active m-1">
          {i}
        </div>,
      );
    } else {
      navElements.push(
        <div key={`${i}`} className="m-1">
          <Link href={`/${i}`}>{i}</Link>
        </div>,
      );
    }
  }

  return (
    <div className="d-flex flex-row w-100 justify-content-center">
      <Link
        className={pageAmount > 1 && current > 1 ? "" : "disabled text-muted"}
        href={`/${current - 1}`}
      >
        {"<"}
      </Link>
      {navElements}
      <Link
        className={pageAmount - current > 1 ? "" : "disabled text-muted"}
        href={`/${current + 1}`}
      >
        {">"}
      </Link>
    </div>
  );
}
