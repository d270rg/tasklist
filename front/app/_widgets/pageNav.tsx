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
        <li className="active" key={i}>
          {i}
        </li>,
      );
    } else {
      navElements.push(
        <li key={i}>
          <Link href={`/${i}`}>{i}</Link>
        </li>,
      );
    }
  }

  return <ul>{navElements}</ul>;
}
