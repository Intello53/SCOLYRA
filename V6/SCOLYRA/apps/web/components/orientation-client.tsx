"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Panel, Badge, EmptyState } from "./ui";
import { StaggerGroup, StaggerItem } from "./motion";
import { Button } from "./button";
import { useCelebrate } from "./celebration";

type Application = { id: string; status: string; formation: { name: string; establishment: string | null; isVerified: boolean } };
type Profile = {
  desiredFields: string | null;
  geographicMaxDistanceKm: number | null;
  geographicPreferredRegions: string[];
};

export function OrientationClient({
  profile,
  applications,
  quizAccessible,
  simulatorAccessible,
}: {
  profile: Profile | null;
  applications: Application[];
  quizAccessible: boolean;
  simulatorAccessible: boolean;
}) {
  const router = useRouter();
  const celebrate = useCelebrate();
  const [desiredFields, setDesiredFields] = useState(profile?.desiredFields ?? "");
  const [maxDistance, setMaxDistance] = useState(profile?.geographicMaxDistanceKm?.toString() ?? "");
  const [regions, setRegions] = useState(profile?.geographicPreferredRegions.join(", ") ?? "");
  const [savingProfile, setSavingProfile] = useState(false);

  const [addingApp, setAddingApp] = useState(false);
  const [formationName, setFormationName] = useState("");
  const [establishment, setEstablishment] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function saveProfile() {
    setSavingProfile(true);
    await fetch("/api/orientation", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        desiredFields,
        geographicMaxDistanceKm: maxDistance ? parseInt(maxDistance, 10) : null,
        geographicPreferredRegions: regions.split(",").map((r) => r.trim()).filter(Boolean),
      }),
    });
    setSavingProfile(false);
    celebrate("Profil d'orientation mis à jour");
    router.refresh();
  }

  async function addApplication() {
    if (!formationName.trim()) return;
    setPending(true);
    setError(null);
    const res = await fetch("/api/orientation/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formationName, establishment: establishment || undefined }),
    });
    setPending(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Erreur lors de l'ajout.");
      return;
    }
    setFormationName("");
    setEstablishment("");
    setAddingApp(false);
    celebrate("Candidature ajoutée");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <StaggerGroup className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <StaggerItem>
          <Panel hover>
            <h2 className="font-display text-lg text-ink-900 dark:text-white">Domaines envisagés</h2>
            <textarea
              value={desiredFields}
              onChange={(e) => setDesiredFields(e.target.value)}
              placeholder="Ex: Écoles d'ingénieur, CPGE MPSI, Licence de mathématiques"
              rows={3}
              className="focus-ring mt-3 w-full rounded-lg border border-ink-900/15 px-3 py-2 text-sm"
            />
            <p className="mt-1 text-xs text-ink-900/40 dark:text-white/40">Séparés par des virgules.</p>
            <Button className="mt-3" onClick={saveProfile} disabled={savingProfile}>
              {savingProfile ? "…" : "Enregistrer"}
            </Button>
          </Panel>
        </StaggerItem>

        <StaggerItem>
          <Panel hover>
            <h2 className="font-display text-lg text-ink-900 dark:text-white">Contrainte géographique</h2>
            <p className="mt-1 text-xs text-ink-900/45 dark:text-white/45">Optionnel — utilisé par le quiz d'orientation.</p>
            <div className="mt-3 space-y-3">
              <input
                type="number"
                min={0}
                value={maxDistance}
                onChange={(e) => setMaxDistance(e.target.value)}
                placeholder="Distance max depuis chez toi (km)"
                className="focus-ring w-full rounded-lg border border-ink-900/15 px-3 py-2 text-sm"
              />
              <input
                value={regions}
                onChange={(e) => setRegions(e.target.value)}
                placeholder="Régions préférées (ex: Île-de-France, Occitanie)"
                className="focus-ring w-full rounded-lg border border-ink-900/15 px-3 py-2 text-sm"
              />
            </div>
            <Button className="mt-3" onClick={saveProfile} disabled={savingProfile}>
              {savingProfile ? "…" : "Enregistrer"}
            </Button>
          </Panel>
        </StaggerItem>
      </StaggerGroup>

      <Panel hover className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-primary-50 to-transparent dark:from-primary-500/10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-lg text-ink-900 dark:text-white">Quiz d'orientation approfondi</h2>
            <Badge tone="gold">Premium</Badge>
          </div>
          <p className="mt-1 max-w-md text-sm text-ink-900/60 dark:text-white/60">
            Une vingtaine de questions pour affiner les grands domaines qui te correspondent, en tenant compte de ta contrainte géographique.
          </p>
        </div>
        {quizAccessible ? (
          <Link href="/orientation/quiz">
            <Button>Commencer le quiz</Button>
          </Link>
        ) : (
          <Link href="/parametres">
            <Button variant="secondary">Passer en Premium</Button>
          </Link>
        )}
      </Panel>

      <Panel hover className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-gold-50 to-transparent dark:from-gold-500/10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-lg text-ink-900 dark:text-white">Simulateur de coût des études</h2>
            <Badge tone="gold">Premium</Badge>
          </div>
          <p className="mt-1 max-w-md text-sm text-ink-900/60 dark:text-white/60">
            Estime le budget annuel selon la voie envisagée (université, BTS, prépa, école privée...) et le logement.
          </p>
        </div>
        {simulatorAccessible ? (
          <Link href="/orientation/simulateur-cout">
            <Button>Ouvrir le simulateur</Button>
          </Link>
        ) : (
          <Link href="/parametres">
            <Button variant="secondary">Passer en Premium</Button>
          </Link>
        )}
      </Panel>

      <div>
        <h2 className="mb-3 font-display text-lg text-ink-900 dark:text-white">Candidatures</h2>
        {applications.length === 0 && !addingApp ? (
          <EmptyState
            title="Aucune candidature enregistrée"
            description="Ajoute une formation qui t'intéresse. SCOLYRA n'invente jamais de données officielles — ce que tu saisis reste marqué comme non vérifié tant qu'aucun import officiel n'existe."
            action={<Button className="mt-2" onClick={() => setAddingApp(true)}>+ Ajouter une candidature</Button>}
          />
        ) : (
          <>
            {error && <div className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
            <Panel className="!p-0">
              <div className="divide-y divide-ink-900/8 dark:divide-white/8">
                {applications.map((a) => (
                  <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                    <div>
                      <p className="text-sm text-ink-900 dark:text-white">{a.formation.name}</p>
                      <p className="text-xs text-ink-900/45 dark:text-white/45">
                        {a.formation.establishment ?? "Établissement non renseigné"}
                        {!a.formation.isVerified && " · saisie manuelle, non vérifiée"}
                      </p>
                    </div>
                    <Badge tone="neutral">{a.status}</Badge>
                  </div>
                ))}
              </div>
            </Panel>
            {addingApp ? (
              <Panel className="mt-3 space-y-3">
                <input
                  value={formationName}
                  onChange={(e) => setFormationName(e.target.value)}
                  placeholder="Nom de la formation"
                  className="focus-ring w-full rounded-lg border border-ink-900/15 px-3 py-2 text-sm"
                />
                <input
                  value={establishment}
                  onChange={(e) => setEstablishment(e.target.value)}
                  placeholder="Établissement (optionnel)"
                  className="focus-ring w-full rounded-lg border border-ink-900/15 px-3 py-2 text-sm"
                />
                <div className="flex gap-2">
                  <Button onClick={addApplication} disabled={pending}>{pending ? "…" : "Ajouter"}</Button>
                  <Button variant="secondary" onClick={() => setAddingApp(false)}>Annuler</Button>
                </div>
              </Panel>
            ) : (
              <Button variant="secondary" className="mt-3" onClick={() => setAddingApp(true)}>
                + Ajouter une candidature
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
