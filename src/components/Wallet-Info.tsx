import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

interface WalletInfoProps {
  address: string;
  networkName: string;
  balance: string;
  getExplorerUrl: (address: string) => string;
}

export function WalletInfo({
  address,
  networkName,
  balance,
  getExplorerUrl,
}: WalletInfoProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Wallet Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-sm font-medium">Address</p>
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground truncate">
                {address}
              </p>
              <a
                href={getExplorerUrl(address)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </a>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">Network</p>
            <p className="text-sm text-muted-foreground">{networkName}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Balance</p>
            <p className="text-sm text-muted-foreground">
              {Number.parseFloat(balance).toFixed(4)} ETH
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
