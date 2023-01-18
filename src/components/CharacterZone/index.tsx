import { FC, useState } from "react";

import { PUBLIC_PATH } from "@/configs";
import { usePlayCard, usePreview, useSkill } from "@/hooks";
import { useChoosePhase } from "@/hooks/phase";
import { ICharacter, Phase, PlayerPosition } from "@/models";
import { useGameStore } from "@/stores";

import styles from "./index.module.css";

export type stateType = "ready" | "battle";

export interface CharacterItemProps {
  character: ICharacter;
  i?: number;
  select?: number;
  pos: PlayerPosition;
}

export const useTransformControl = () => {
  const [state, setState] = useState(["ready", "ready", "ready"]);
  const animationControl = (i: number) => {
    const _state = state.map((s, index) =>
      index != i ? "ready" : s === "ready" ? "battle" : "ready"
    );
    setState(_state);
  };

  return { state, animationControl };
};

export const CharacterItem: FC<CharacterItemProps> = props => {
  const { character, i, select, pos } = props;
  const { phase, activeCharacters } = useGameStore();
  const { onPreview } = usePreview();
  const { calDamage } = useSkill(pos);
  if (!character) {
    return <></>;
  }
  return (
    <div
      aria-hidden="true"
      className={styles.CharacterItem}
      onClick={() => {
        onPreview(character);
      }}
    >
      {phase !== Phase.Init && (
        <>
          <div className={styles.CharacterElementStatus}>
            <div className={styles.CharacterElementStatusItem}>
              <img
                src={`${PUBLIC_PATH}/images/dendro-elementicon.png`}
                alt=""
              />
            </div>
            <div className={styles.CharacterElementStatusItem}>
              <img
                src={`${PUBLIC_PATH}/images/electro-elementicon.png`}
                alt=""
              />
            </div>
          </div>
          {i !== undefined && i === select && (
            <div className={styles.CharacterSelected}></div>
          )}
          {phase === Phase.Skill &&
            i === activeCharacters[pos] &&
            pos === PlayerPosition.Opponent && (
              <div className={styles.CharacterDamage}>
                -{calDamage().damage}
              </div>
            )}
          <div className={styles.CharacterHealth}>{character.hp}</div>
          <div className={styles.CharacterEnergy}>
            <div className={styles.CharacterEnergyItem}></div>
            <div className={styles.CharacterEnergyItem}></div>
            <div className={styles.CharacterEmptyEnergyItem}></div>
          </div>
          <div className={styles.CharacterEquipment}>
            {character.equipments.weapon && (
              <div className={styles.CharacterWeapon}></div>
            )}
            {character.equipments.artifact && (
              <div className={styles.CharacterArtifact}></div>
            )}
            {character.equipments.talent && (
              <div className={styles.CharacterTalent}></div>
            )}
          </div>
        </>
      )}
      <img src={`${PUBLIC_PATH}/characters/${character.imgID}.png`} alt="" />
    </div>
  );
};

export interface CharacterZoneProps {
  characters: ICharacter[];
  pos: PlayerPosition;
  setSelect?: (v: number) => void;
  select?: number;
}

export default function CharacterZone(props: CharacterZoneProps) {
  const { characters, pos, setSelect, select } = props;
  const { phase, activeCharacters } = useGameStore();
  const active = activeCharacters[pos];
  const { setActiveCharacter, onChoosePhaseEnd } = useChoosePhase(pos);
  const { shouldCharacterHighlight } = usePlayCard();
  const { animationControl } = useTransformControl();
  const { shouldCharacterHignlight } = useSkill(pos);
  const toggleControl = (index: number) => {
    if (pos === PlayerPosition.Own) {
      setSelect && setSelect(index);
      if (index === select && phase === Phase.Choose) {
        animationControl(index);
        setActiveCharacter();
        onChoosePhaseEnd();
      }
    }
  };

  const _Y = pos === PlayerPosition.Own ? 20 : -20;

  const defaultStyle = {
    transition: "500ms",
  };

  const transformStyles = {
    battle: { transform: `translateY(${-_Y}px)` },
    ready: { transform: `translateY(${_Y}px)` },
  };

  const style = (index: number) => ({
    ...defaultStyle,
    ...(transformStyles[index === active ? "battle" : "ready"] ?? {}),
  });
  const isCharacterHighlight = shouldCharacterHighlight(pos);
  return (
    <div className={styles.CharacterZone}>
      <div className={styles.CharacterList}>
        {characters.map((character, index) => (
          <div
            key={index}
            style={{
              zIndex:
                isCharacterHighlight || shouldCharacterHignlight(index)
                  ? 22
                  : 9,
              ...style(index),
            }}
            aria-hidden="true"
            onClick={() => toggleControl(index)}
          >
            <CharacterItem
              character={character}
              i={index}
              select={select}
              pos={pos}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
