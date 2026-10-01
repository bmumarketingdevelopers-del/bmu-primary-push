"use client";

import * as React from "react";
import {
  Archive, ChevronRight, FileText, Film, Folder, Image as ImageIcon,
  Package, Search, Tag, X,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { MediaAsset } from "@/lib/admin-data";
import { formatDate, cn } from "@/lib/utils";
import styles from "./media-browser.module.css";

const ICON_FOR = (mime: string) =>
  mime.startsWith("image/") ? ImageIcon
  : mime.startsWith("video/") ? Film
  : mime === "application/zip" ? Package
  : FileText;

/** Sizes read as GB/MB/KB — 842000000 tells you nothing at a glance. */
function readableSize(bytes: number) {
  if (bytes >= 1_000_000_000) return `${(bytes / 1_000_000_000).toFixed(1)} GB`;
  if (bytes >= 1_000_000) return `${Math.round(bytes / 1_000_000)} MB`;
  return `${Math.round(bytes / 1000)} KB`;
}

type Node = { name: string; path: string; children: Node[]; count: number; size: number };

/**
 * Builds the folder tree from asset paths.
 *
 * Folders are a naming convention rather than rows in a table — that keeps
 * moves and renames trivial, and there are no orphan folders to clean up
 * when the last file in one is deleted.
 */
function buildTree(assets: MediaAsset[]): Node[] {
  const root: Node[] = [];

  for (const a of assets) {
    if (!a.folder) continue;
    let level = root;
    let prefix = "";

    for (const segment of a.folder.split("/")) {
      prefix = prefix ? `${prefix}/${segment}` : segment;
      let node = level.find((n) => n.name === segment);
      if (!node) {
        node = { name: segment, path: prefix, children: [], count: 0, size: 0 };
        level.push(node);
      }
      node.count += 1;
      node.size += a.sizeBytes;
      level = node.children;
    }
  }

  const sort = (nodes: Node[]): Node[] =>
    nodes.sort((a, b) => a.name.localeCompare(b.name)).map((n) => ({ ...n, children: sort(n.children) }));

  return sort(root);
}

export function MediaBrowser({ assets }: { assets: MediaAsset[] }) {
  const [folder, setFolder] = React.useState("");
  const [query, setQuery] = React.useState("");
  const [tag, setTag] = React.useState("");
  const [showArchived, setShowArchived] = React.useState(false);

  const tree = React.useMemo(() => buildTree(assets), [assets]);
  const allTags = React.useMemo(
    () => [...new Set(assets.flatMap((a) => a.tags))].sort(),
    [assets]
  );

  const visible = assets.filter((a) => {
    if (!showArchived && a.isArchived) return false;
    // Selecting a folder includes everything beneath it.
    if (folder && !a.folder.startsWith(folder)) return false;
    if (tag && !a.tags.includes(tag)) return false;
    if (query) {
      const q = query.toLowerCase();
      const hay = `${a.filename} ${a.tags.join(" ")} ${a.client ?? ""} ${a.altText ?? ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const usedBytes = assets.filter((a) => !a.isArchived).reduce((s, a) => s + a.sizeBytes, 0);
  const crumbs = folder ? folder.split("/") : [];

  return (
    <div className={styles.layout}>
      {/* Folders */}
      <aside className={styles.sidebar}>
        <Card className={styles.panel}>
          <p className={styles.panelLabel}>
            Folders
          </p>

          <button
            type="button"
            onClick={() => setFolder("")}
            className={cn(
              styles.folderButton,
              styles.folderRoot,
              !folder ? styles.folderActive : styles.folderIdle
            )}
          >
            <Folder className={styles.folderIcon} /> Everything
            <span className={styles.folderCount}>{assets.length}</span>
          </button>

          <FolderTree nodes={tree} current={folder} onSelect={setFolder} depth={0} />
        </Card>

        <Card className={styles.panel}>
          <p className={styles.panelLabel}>
            Storage
          </p>
          <p className={cn("display", styles.storageValue)}>{readableSize(usedBytes)}</p>
          <p className={styles.storageMeta}>
            across {assets.filter((a) => !a.isArchived).length} live files
          </p>
          <p className={styles.storageNote}>
            Raw shoot folders are usually most of this. Worth archiving once a project ships.
          </p>
        </Card>
      </aside>

      {/* Files */}
      <div className={styles.main}>
        <Card className={styles.filters}>
          <div className={styles.searchRow}>
            <div className={styles.searchBox}>
              <Search className={styles.searchIcon} />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search media by filename, tag, client or alt text"
                type="search"
                placeholder="Search filename, tag, client or alt text"
                className={styles.searchInput}
              />
            </div>
            <Button
              type="button"
              variant={showArchived ? "default" : "outline"}
              size="sm"
              onClick={() => setShowArchived((v) => !v)}
            >
              <Archive /> {showArchived ? "Hiding nothing" : "Show archived"}
            </Button>
          </div>

          <div className={styles.tagRow}>
            <Tag className={styles.tagIcon} />
            {allTags.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTag(tag === t ? "" : t)}
                className={cn(styles.tagChip, tag === t ? styles.tagChipOn : styles.tagChipOff)}
              >
                {t}
              </button>
            ))}
          </div>

          {(folder || tag || query) && (
            <div className={styles.activeFilters}>
              <span className={styles.showingLabel}>Showing</span>
              {crumbs.map((c, i) => (
                <span key={c} className={styles.crumb}>
                  {i > 0 && <ChevronRight className={styles.crumbIcon} />}
                  <button
                    type="button"
                    onClick={() => setFolder(crumbs.slice(0, i + 1).join("/"))}
                    className={styles.crumbButton}
                  >
                    {c}
                  </button>
                </span>
              ))}
              {tag && <Badge variant="outline">#{tag}</Badge>}
              <button
                type="button"
                onClick={() => { setFolder(""); setTag(""); setQuery(""); }}
                className={styles.clearButton}
              >
                <X className={styles.clearIcon} /> Clear
              </button>
            </div>
          )}
        </Card>

        <div className={styles.fileGrid}>
          {visible.map((a) => {
            const Icon = ICON_FOR(a.mimeType);
            return (
              <Card key={a.id} className={cn(styles.fileCard, a.isArchived && styles.fileCardArchived)}>
                <div className={styles.thumb}>
                  <Icon className={styles.thumbIcon} strokeWidth={1.5} />
                </div>
                <div className={styles.fileBody}>
                  <p className={styles.fileName} title={a.filename}>
                    {a.filename}
                  </p>
                  <p className={styles.fileMeta}>
                    {readableSize(a.sizeBytes)} · {formatDate(a.createdAt)}
                  </p>
                  {a.altText ? (
                    <p className={styles.fileAlt}>{a.altText}</p>
                  ) : a.mimeType.startsWith("image/") ? (
                    <p className={styles.fileAltMissing}>No alt text</p>
                  ) : null}

                  <div className={styles.fileTags}>
                    {a.tags.map((t) => (
                      <Badge key={t} variant="outline" className={styles.fileTag}>{t}</Badge>
                    ))}
                    {a.isArchived && <Badge variant="secondary" className={styles.fileTag}>archived</Badge>}
                  </div>

                  <p className={styles.filePath}>
                    {a.folder || "root"}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

        {visible.length === 0 && (
          <Card className={styles.empty}>
            Nothing matches. Clear the filters or search something else.
          </Card>
        )}
      </div>
    </div>
  );
}

function FolderTree({
  nodes, current, onSelect, depth,
}: {
  nodes: Node[]; current: string; onSelect: (p: string) => void; depth: number;
}) {
  return (
    <ul className={cn(depth > 0 && styles.subtree)}>
      {nodes.map((n) => {
        const active = current === n.path;
        const open = current.startsWith(n.path);
        return (
          <li key={n.path}>
            <button
              type="button"
              onClick={() => onSelect(active ? "" : n.path)}
              className={cn(
                styles.folderButton,
                styles.folderNode,
                active ? styles.folderActive : styles.folderIdle
              )}
            >
              <Folder className={styles.folderIconSmall} />
              <span className={styles.nodeName}>{n.name}</span>
              <span className={styles.nodeCount}>{n.count}</span>
            </button>
            {open && n.children.length > 0 && (
              <FolderTree nodes={n.children} current={current} onSelect={onSelect} depth={depth + 1} />
            )}
          </li>
        );
      })}
    </ul>
  );
}
