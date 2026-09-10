import fs from 'fs';
const file = 'src/tests/ventilation/ashrae-621-zone.test.ts';
let content = fs.readFileSync(file, 'utf8');

// The `makeWithProvenance` needs to include `standard: 'ASHRAE 62.1', edition: '2025', revision: '2025', reference: 'Table 6.2.2.1'` for the subfields.
const oldMakeWithProvenance = `const makeWithProvenance = (sourceType: string, verificationStatus: string) => {
        const item = { ...verifiedOffice, sourceType, verificationStatus };
        if (item.provenance) {
            item.provenance = {
                rp: { ...item.provenance.rp, sourceType, verificationStatus },
                ra: { ...item.provenance.ra, sourceType, verificationStatus },
                defaultOccupancy: { ...item.provenance.defaultOccupancy, sourceType, verificationStatus },
                reference: { ...item.provenance.reference, sourceType, verificationStatus }
            } as any;
        }
        return item;
    };`;
    
const newMakeWithProvenance = `const makeWithProvenance = (sourceType: string, verificationStatus: string) => {
        const item = { ...verifiedOffice, sourceType, verificationStatus };
        const applyProv = (prov) => ({
            ...prov,
            sourceType,
            verificationStatus,
            standard: 'ASHRAE 62.1',
            edition: '2025',
            revision: '2025',
            reference: 'Table 6.2.2.1'
        });
        if (item.provenance) {
            item.provenance = {
                rp: applyProv(item.provenance.rp),
                ra: applyProv(item.provenance.ra),
                defaultOccupancy: applyProv(item.provenance.defaultOccupancy),
                reference: applyProv(item.provenance.reference)
            } as any;
        }
        return item;
    };`;

content = content.replace(oldMakeWithProvenance, newMakeWithProvenance);

// verifiedEz needs the same treatment if it has provenance? Wait, ezConfig in tests...
const applyProvToEz = `const applyProvEz = (prov, sourceType, verificationStatus) => ({
            ...prov,
            sourceType,
            verificationStatus,
            standard: 'ASHRAE 62.1',
            edition: '2025',
            revision: '2025',
            reference: 'Table 6-4'
        });
        `;

// Actually I can just add standard, edition, revision, reference to verifiedEz's provenance directly where it's defined. Let's check where verifiedEz is defined.
fs.writeFileSync(file, content);
