import Image from "next/image";
import { getClients } from "../lib/clients";
import { PlaceholderIcon } from "./PlaceholderIcon";

export const dynamic = "force-dynamic";

const clientIds = ["scoutview", "usher"];

export default async function Home() {
  const clients = await getClients();

  const userClients = clients.filter(
    (client) => clientIds.includes(client.id) || client.alwaysShow,
  );

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {userClients.map((client) => (
        <a
          href={client.url}
          target="_parent"
          key={client.id}
          className={`
            aspect-square flex flex-col items-center justify-center
            rounded-xl
            hover:bg-gray-200
          `}
        >
          <div className="relative w-24 h-24 mb-2">
            {client.logoUrl ? (
              <Image
                src={client.logoUrl}
                alt={client.name}
                layout="fill"
                objectFit="contain"
              />
            ) : (
              <PlaceholderIcon className="w-full h-full" />
            )}
          </div>
          {client.name}
        </a>
      ))}
    </div>
  );
}
