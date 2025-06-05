
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Globe, 
  ExternalLink, 
  Check, 
  AlertCircle, 
  Copy, 
  Settings,
  Crown,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { usePlan } from "@/contexts/PlanContext";

interface CustomDomainManagerProps {
  websiteId: string;
  websiteName: string;
  currentDomain?: string;
  onDomainUpdate?: (domain: string) => void;
}

const CustomDomainManager: React.FC<CustomDomainManagerProps> = ({
  websiteId,
  websiteName,
  currentDomain,
  onDomainUpdate
}) => {
  const { isPremium, isEnterprise, checkUpgrade } = usePlan();
  const [domain, setDomain] = useState(currentDomain || "");
  const [isChecking, setIsChecking] = useState(false);
  const [domainStatus, setDomainStatus] = useState<"unchecked" | "valid" | "invalid" | "pending">("unchecked");
  const [dnsRecords, setDnsRecords] = useState<any[]>([]);

  // Check if user has premium access
  const hasCustomDomainAccess = isPremium || isEnterprise;

  // Netlify configuration
  const netlifyConfig = {
    primaryDomain: "aetherwebsites.com",
    subdomain: `${websiteId}.aetherwebsites.com`,
    netlifyUrl: `https://${websiteId}.netlify.app`
  };

  useEffect(() => {
    if (currentDomain) {
      setDomain(currentDomain);
      checkDomainStatus(currentDomain);
    }
  }, [currentDomain]);

  const checkDomainStatus = async (domainToCheck: string) => {
    if (!domainToCheck) return;
    
    setIsChecking(true);
    setDomainStatus("pending");

    try {
      // Simulate DNS check - in real implementation, this would check actual DNS records
      const response = await fetch(`https://dns.google/resolve?name=${domainToCheck}&type=CNAME`);
      const data = await response.json();
      
      // Check if domain points to Netlify
      const hasCorrectCNAME = data.Answer?.some((record: any) => 
        record.data?.includes('netlify.app') || record.data?.includes('aetherwebsites.com')
      );

      if (hasCorrectCNAME) {
        setDomainStatus("valid");
        toast.success("Domain is correctly configured!");
      } else {
        setDomainStatus("invalid");
        generateDnsRecords(domainToCheck);
      }
    } catch (error) {
      console.error("Error checking domain:", error);
      setDomainStatus("invalid");
      generateDnsRecords(domainToCheck);
    } finally {
      setIsChecking(false);
    }
  };

  const generateDnsRecords = (domainName: string) => {
    const isSubdomain = domainName.includes('.') && domainName.split('.').length > 2;
    const rootDomain = isSubdomain ? domainName.split('.').slice(-2).join('.') : domainName;
    const subdomain = isSubdomain ? domainName.split('.')[0] : 'www';

    setDnsRecords([
      {
        type: "CNAME",
        name: isSubdomain ? subdomain : "www",
        value: netlifyConfig.primaryDomain,
        description: `Points ${isSubdomain ? 'subdomain' : 'www'} to your website`
      },
      {
        type: "ALIAS/ANAME",
        name: "@",
        value: netlifyConfig.primaryDomain,
        description: "Points root domain to your website (if supported by your DNS provider)"
      }
    ]);
  };

  const handleDomainSubmit = async () => {
    if (!hasCustomDomainAccess) {
      if (checkUpgrade) {
        checkUpgrade("Custom Domain");
      }
      return;
    }

    if (!domain) {
      toast.error("Please enter a domain name");
      return;
    }

    // Validate domain format
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]\.([a-zA-Z]{2,})+$/;
    if (!domainRegex.test(domain)) {
      toast.error("Please enter a valid domain name");
      return;
    }

    await checkDomainStatus(domain);
    
    if (onDomainUpdate) {
      onDomainUpdate(domain);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const getDomainStatusBadge = () => {
    switch (domainStatus) {
      case "valid":
        return <Badge className="bg-green-100 text-green-800"><Check className="h-3 w-3 mr-1" />Active</Badge>;
      case "invalid":
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Setup Required</Badge>;
      case "pending":
        return <Badge variant="secondary"><Loader2 className="h-3 w-3 mr-1 animate-spin" />Checking...</Badge>;
      default:
        return <Badge variant="outline">Not Configured</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Custom Domain Settings
            {!hasCustomDomainAccess && (
              <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-white">
                <Crown className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!hasCustomDomainAccess && (
            <Alert>
              <Crown className="h-4 w-4" />
              <AlertDescription>
                Custom domains are available with Premium plans. Upgrade to connect your own domain to your website.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="domain">Your Custom Domain</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="domain"
                  placeholder="yourdomain.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  disabled={!hasCustomDomainAccess}
                />
                <Button 
                  onClick={handleDomainSubmit}
                  disabled={!hasCustomDomainAccess || isChecking}
                  variant={hasCustomDomainAccess ? "default" : "outline"}
                >
                  {isChecking ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : hasCustomDomainAccess ? (
                    "Configure"
                  ) : (
                    "Upgrade"
                  )}
                </Button>
              </div>
            </div>

            {domain && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Status:</span>
                {getDomainStatusBadge()}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Current URLs */}
      <Card>
        <CardHeader>
          <CardTitle>Current Website URLs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Primary URL</p>
              <p className="text-sm text-gray-600">{netlifyConfig.subdomain}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`https://${netlifyConfig.subdomain}`, '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Netlify URL</p>
              <p className="text-sm text-gray-600">{netlifyConfig.netlifyUrl}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(netlifyConfig.netlifyUrl, '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>

          {domain && domainStatus === "valid" && (
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div>
                <p className="font-medium text-green-800">Custom Domain</p>
                <p className="text-sm text-green-600">https://{domain}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`https://${domain}`, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* DNS Configuration */}
      {dnsRecords.length > 0 && domainStatus === "invalid" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              DNS Configuration Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                To use your custom domain, add these DNS records to your domain provider's settings.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              {dnsRecords.map((record, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{record.type}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(record.value)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Name/Host: </span>
                      <code className="bg-gray-100 px-2 py-1 rounded">{record.name}</code>
                    </div>
                    <div>
                      <span className="font-medium">Value/Points to: </span>
                      <code className="bg-gray-100 px-2 py-1 rounded">{record.value}</code>
                    </div>
                    <p className="text-gray-600">{record.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Alert className="mt-4">
              <AlertDescription>
                DNS changes can take up to 48 hours to propagate. After adding these records, click "Configure" again to verify the setup.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CustomDomainManager;
