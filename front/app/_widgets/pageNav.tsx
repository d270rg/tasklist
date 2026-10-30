import Link from "next/link";

export function PageNavigation({
  pageAmount,
  current,
}: {
  pageAmount: number;
  current: number;
}) {
  const navElements = [];
  const canGoNext = pageAmount - current >= 1;
  const canGoPrev = pageAmount > 1 && current > 1;

  for (let i = 1; i <= pageAmount; i++) {
    if (i === current) {
      navElements.push(
        <div key={`${i}`} className="active btn disabled m-1 bg-2 text-light">
          {i}
        </div>,
      );
    } else {
      navElements.push(
        <Link href={`/${i}`}>
          <div key={`${i}`} className="btn m-1 bg-2 text-light">
            {i}
          </div>
        </Link>,
      );
    }
  }

  return (
    <div className="d-flex flex-row w-100 justify-content-center align-items-center">
      <Link className={canGoPrev ? "" : "disabled"} href={`/${current - 1}`}>
        <div
          className={canGoPrev ? "btn bg-2 text-light" : "btn bg-1 text-muted"}
        >
          {"<"}
        </div>
      </Link>
      {navElements}
      <Link className={canGoNext ? "" : "disabled"} href={`/${current + 1}`}>
        <div
          className={canGoNext ? "btn bg-2 text-light" : "btn bg-1 text-muted"}
        >
          {">"}
        </div>
      </Link>
    </div>
  );
}
