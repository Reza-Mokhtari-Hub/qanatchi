import { useState } from 'react';
import { Check, UserCheck } from 'lucide-react';
import { getOrCreateAnonymousPlayerId, updatePlayerProfile } from '../api/edgeClient';
import {
  getPlayerDisplayLabel,
  setPlayerDisplayLabel,
} from '../storage/submissionQueue';

export function PlayerNicknameControl() {
  const [nickname, setNickname] = useState<string>(() => getPlayerDisplayLabel());
  const [savedNotice, setSavedNotice] = useState<boolean>(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = setPlayerDisplayLabel(nickname);
    setNickname(cleaned);
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 2200);

    const playerId = getOrCreateAnonymousPlayerId();
    await updatePlayerProfile(playerId, cleaned);
  };

  return (
    <form
      onSubmit={handleSave}
      data-testid="player-nickname-form"
      className="rounded-2xl bg-[#1A1510] border border-[#3B2E22] px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
    >
      <label
        htmlFor="qanatchi-player-nickname"
        className="text-xs sm:text-sm text-[#D7C6AA] flex items-center gap-2 shrink-0"
      >
        <UserCheck className="w-4 h-4 text-[#5BE8F5] shrink-0" aria-hidden="true" />
        <span>نام نمایشی در جدول امتیازات:</span>
      </label>

      <div className="flex items-center gap-2 flex-1 sm:max-w-xs">
        <input
          id="qanatchi-player-nickname"
          type="text"
          maxLength={24}
          data-testid="input-player-nickname"
          value={nickname}
          onChange={(e) => {
            setNickname(e.target.value);
            if (savedNotice) setSavedNotice(false);
          }}
          placeholder="مسافر قنات"
          className="flex-1 min-h-[40px] px-3 rounded-xl bg-[#120E0A] border border-[#4D3B28] text-sm text-[#FBF4E4] placeholder:text-[#7E6B53] focus:outline-none focus:ring-2 focus:ring-[#5BE8F5]"
        />
        <button
          type="submit"
          data-testid="btn-save-player-nickname"
          className="min-h-[40px] px-3.5 rounded-xl bg-[#1E3B42] hover:bg-[#264C55] border border-[#2F7582] text-[#E6FAFC] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          {savedNotice ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#7DF8C4] shrink-0" aria-hidden="true" />
              <span>ذخیره شد</span>
            </>
          ) : (
            <span>ثبت نام</span>
          )}
        </button>
      </div>
    </form>
  );
}
