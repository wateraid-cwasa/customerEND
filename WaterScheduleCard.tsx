// The water supply schedule. It is shown in two ways:
// - WaterScheduleCard: a card on the Support tab and the guest Public services screen.
// - WaterScheduleModal: a pop-up opened from the Water schedule tile on Home.
// The schedule is public, so it loads without signing in, and it loads again each time it appears.

import { useCallback, useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getActiveWaterSchedule } from './consumerApi';
import { colors, fontFamilyForText } from './theme';
import { Language, translate } from './translation';
import { formatScheduleDate, scheduleLines, type ScheduleLanguage, type WaterSchedule } from './waterSchedule';

type Status = 'loading' | 'ready' | 'error';

function useWaterSchedule(enabled: boolean) {
  const [schedule, setSchedule] = useState<WaterSchedule | null>(null);
  const [status, setStatus] = useState<Status>('loading');

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      setSchedule(await getActiveWaterSchedule());
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    if (enabled) load();
  }, [enabled, load]);

  return { schedule, status, load };
}

// One button that shows both languages. The highlighted one is on screen, and pressing it switches to the other.
function LanguageButton({ value, onChange }: { value: ScheduleLanguage; onChange: (language: ScheduleLanguage) => void }) {
  const segment = (title: string, language: ScheduleLanguage) => (
    <View style={[styles.segment, value === language && styles.segmentOn]}>
      <Text style={[styles.segmentText, value === language && styles.segmentTextOn, { fontFamily: fontFamilyForText(title, false, language) }]}>{title}</Text>
    </View>
  );
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="English / বাংলা"
      onPress={() => onChange(value === 'en' ? 'bn' : 'en')}
      style={styles.languageButton}
    >
      {segment('English', 'en')}
      {segment('বাংলা', 'bn')}
    </Pressable>
  );
}

function ScheduleBody({ language, enabled }: { language: Language; enabled: boolean }) {
  const { schedule, status, load } = useWaterSchedule(enabled);
  // Until the customer presses the language button, the schedule follows the app language.
  const [picked, setPicked] = useState<ScheduleLanguage | null>(null);
  const shownLanguage: ScheduleLanguage = picked ?? language;
  const shown = schedule ? scheduleLines(schedule, shownLanguage) : null;
  const effective = schedule ? formatScheduleDate(schedule.activatedFrom, shown?.language ?? shownLanguage) : '';

  const text = (content: string, style?: object) => (
    <Text style={[styles.text, { fontFamily: fontFamilyForText(content, false, language) }, style]}>{content}</Text>
  );

  return (
    <View>
      <View style={styles.languageRow}>
        <LanguageButton value={shownLanguage} onChange={setPicked} />
      </View>
      {status === 'loading' && !schedule ? text(translate(language, 'scheduleLoading'), styles.note) : null}
      {status === 'error' && !schedule ? (
        <View>
          {text(translate(language, 'scheduleLoadError'), styles.note)}
          <Pressable accessibilityRole="button" onPress={load} style={styles.retry}>
            {text(translate(language, 'scheduleRetry'), styles.retryText)}
          </Pressable>
        </View>
      ) : null}
      {status === 'ready' && !schedule ? text(translate(language, 'noWaterSchedule'), styles.note) : null}
      {shown ? (
        <View>
          {shown.lines.map((line, index) => (
            <Text key={`${index}-${line}`} style={[styles.line, { fontFamily: fontFamilyForText(line, false, shown.language) }]}>{line}</Text>
          ))}
          {effective ? text(`${translate(shown.language, 'scheduleEffectiveFrom')}: ${effective}`, styles.note) : null}
        </View>
      ) : null}
    </View>
  );
}

export default function WaterScheduleCard({ language }: { language: Language }) {
  return (
    <View style={styles.card}>
      <Text style={[styles.title, { fontFamily: fontFamilyForText(translate(language, 'waterSchedule'), true, language) }]}>{translate(language, 'waterSchedule')}</Text>
      <ScheduleBody language={language} enabled />
    </View>
  );
}

export function WaterScheduleModal({ visible, language, onClose }: { visible: boolean; language: Language; onClose: () => void }) {
  const title = translate(language, 'waterSchedule');
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel={translate(language, 'close')}>
        {/* A press inside the sheet must not reach the backdrop, which closes the pop-up. */}
        <Pressable style={styles.sheet} onPress={() => undefined}>
          <View style={styles.sheetHeader}>
            <Text style={[styles.sheetTitle, { fontFamily: fontFamilyForText(title, true, language) }]}>{title}</Text>
            <Pressable accessibilityRole="button" accessibilityLabel={translate(language, 'close')} onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>
          <ScrollView style={styles.sheetScroll}>
            <ScheduleBody language={language} enabled={visible} />
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 16, marginBottom: 12 },
  text: { color: colors.ink, fontSize: 14 },
  title: { color: colors.ink, fontSize: 16, marginBottom: 10 },
  languageRow: { flexDirection: 'row', marginBottom: 12 },
  languageButton: { flexDirection: 'row', borderWidth: 1, borderColor: colors.blue, borderRadius: 18, overflow: 'hidden' },
  segment: { paddingHorizontal: 14, paddingVertical: 7, backgroundColor: colors.white },
  segmentOn: { backgroundColor: colors.blue },
  segmentText: { color: colors.blue, fontSize: 13 },
  segmentTextOn: { color: colors.white },
  line: { color: colors.ink, fontSize: 14, lineHeight: 22 },
  note: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 8 },
  retry: { alignSelf: 'flex-start', paddingVertical: 8 },
  retryText: { color: colors.blue, fontSize: 13 },
  backdrop: { flex: 1, backgroundColor: 'rgba(23,36,55,0.5)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  sheet: { width: '100%', maxWidth: 480, maxHeight: '80%', backgroundColor: colors.white, borderRadius: 18, padding: 18 },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sheetTitle: { flex: 1, color: colors.ink, fontSize: 17 },
  closeButton: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.paleBlue },
  closeText: { color: colors.blue, fontSize: 15 },
  sheetScroll: { flexGrow: 0 },
});
