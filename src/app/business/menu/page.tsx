import { Download, Plus, QrCode } from "lucide-react";
import { BusinessTopbar } from "@/components/business/topbar";
import { EntityDialog } from "@/components/admin/entity-dialog";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RowActions } from "@/components/admin/row-actions";
import { DEMO_MENU, DEMO_TABLES, FOOD_LABEL } from "@/lib/menu";
import { MENU_STATS } from "@/lib/business-data";
import { cn, inr } from "@/lib/utils";
import styles from "./page.module.css";

export default function BusinessMenuPage() {
  const categories = DEMO_MENU["saffron-co"];
  const items = categories.flatMap((c) => c.items);
  const unavailable = items.filter((i) => !i.isAvailable);

  return (
    <>
      <BusinessTopbar title="Menu" />
      <div className={styles.page}>
        <PageShell
          title="Menu"
          description="Change a price or mark something finished and every table QR updates instantly. No reprinting, no stickers over the old price."
          action={<EntityDialog entity="menuItem" label="Add item" />}
        >
          <div className={styles.statGrid}>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Items on the menu</p>
              <p className={cn("display", styles.statValue)}>{items.length}</p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Finished today</p>
              <p className={cn("display", styles.statValue)}>{unavailable.length}</p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Best seller</p>
              <p className={cn("display", styles.bestSeller)}>{MENU_STATS.topItem}</p>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className={styles.iconTitle}>
                <QrCode className={styles.titleIcon} /> Table QR codes
              </CardTitle>
              <CardDescription>
                Each table gets its own code, so an order arrives already knowing where to go. Nobody
                has to type a table number.
              </CardDescription>
            </CardHeader>
            <CardContent className={styles.tableGrid}>
              {DEMO_TABLES.map((t) => (
                <div key={t.id} className={styles.tableTile}>
                  <p className={styles.tableLabel}>{t.label}</p>
                  <p className={styles.tableSeats}>{t.seats} seats</p>
                  <p className={styles.tableUrl}>
                    /b/saffron-co/menu?t={t.qrCode}
                  </p>
                  <div className={styles.tableActions}>
                    <Button asChild variant="outline" size="sm">
                      <a href={`/api/qr/${t.qrCode}?f=png&d=1`}><Download /> Print QR</a>
                    </Button>
                    <Button asChild variant="ghost" size="sm">
                      <a href={`/b/saffron-co/menu?t=${t.qrCode}`} target="_blank" rel="noreferrer">
                        Preview
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {categories.map((c) => (
            <Card key={c.id}>
              <CardHeader className={styles.categoryHeader}>
                <div>
                  <CardTitle className={styles.categoryTitle}>{c.name}</CardTitle>
                  {c.description && <CardDescription>{c.description}</CardDescription>}
                </div>
                <EntityDialog entity="menuItem" label={`Add to ${c.name}`} variant="ghost" />
              </CardHeader>
              <CardContent>
                <div className={styles.itemList}>
                  {c.items.map((i) => {
                    const food = FOOD_LABEL[i.foodType];
                    return (
                      <div key={i.id} className={styles.item}>
                        <div className={styles.itemMain}>
                          <span
                            className={styles.foodMark}
                            style={{ "--food-color": food.color } as React.CSSProperties}
                          >
                            <span className={styles.foodDot} />
                          </span>
                          <div className={styles.itemText}>
                            <p className={styles.itemName}>
                              {i.name}
                              {i.isBestseller && (
                                <Badge variant="warning" className={styles.popularBadge}>Popular</Badge>
                              )}
                            </p>
                            {i.description && (
                              <p className={styles.itemDescription}>{i.description}</p>
                            )}
                            <p className={styles.itemPrep}>{i.prepMinutes} min prep</p>
                          </div>
                        </div>

                        <div className={styles.itemMeta}>
                          <span className={styles.itemPrice}>{inr(i.price)}</span>
                          <Badge variant={i.isAvailable ? "success" : "destructive"}>
                            {i.isAvailable ? "Available" : "Finished"}
                          </Badge>
                          <RowActions entity="menuItem" record={i as unknown as Record<string, unknown>} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </PageShell>
      </div>
    </>
  );
}
