import {
  Table,
  TableBody,
  TableCell,
  TableCellLayout,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableSelectionCell,
} from '@fluentui/react-components';
import type { VoiceInfo } from 'microsoft-cognitiveservices-speech-sdk';
import { useTranslations } from 'next-intl';

type Props = {
  voices: VoiceInfo[];
  selectedVoiceName: VoiceInfo['name'];
  onSelectVoice: (shortName: VoiceInfo['shortName']) => void;
};

export default function VoiceTable({ voices, selectedVoiceName, onSelectVoice }: Props) {
  const t = useTranslations('VoiceSwitcher');

  const columns = [
    { columnKey: 'name', label: 'Name' },
    { columnKey: 'locale', label: 'Locale' },
    { columnKey: 'gender', label: 'Gender' },
  ];

  return (
    <Table style={{ margin: '1em' }}>
      <TableHeader>
        <TableRow>
          <TableSelectionCell type="radio" invisible />
          {columns.map((column) => (
            <TableHeaderCell key={column.columnKey}>{column.label}</TableHeaderCell>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {voices.map((voice, index) => (
          <TableRow key={index} onClick={() => onSelectVoice(voice.shortName)}>
            <TableSelectionCell
              checked={voice.shortName === selectedVoiceName}
              type="radio"
              radioIndicator={{ 'aria-label': 'Select row' }}
            />
            <TableCell>
              <TableCellLayout>{voice.localName}</TableCellLayout>
            </TableCell>
            <TableCell>
              <TableCellLayout>{voice.localeName}</TableCellLayout>
            </TableCell>
            <TableCell>{t(voice.gender.toString())}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
