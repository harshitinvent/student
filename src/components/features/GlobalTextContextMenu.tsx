import { useEffect, useRef, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  TextSmallcapsIcon,
  TextIndentIcon,
  TextIcon,
  Link02Icon,
} from '@hugeicons/core-free-icons';

type Position = { x: number; y: number } | null;

export default function GlobalTextContextMenu() {
  const [menuPosition, setMenuPosition] = useState<Position>(null);
  const [selectedText, setSelectedText] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleMouseUp(e: MouseEvent) {
      const selection = window.getSelection();
      const text = selection?.toString().trim();

      if (!text) {
        hideMenu();
        return;
      }

      const anchorNode = selection?.anchorNode;
      const allowedParent =
        anchorNode?.parentElement?.closest('.with-context-menu');

      if (allowedParent) {
        const range = selection?.getRangeAt(0);
        const rect = range?.getBoundingClientRect();

        setSelectedText(text);
        setMenuPosition({
          x: (rect?.left || 0) + window.scrollX,
          y: (rect?.bottom || 0) + window.scrollY,
        });
      } else {
        hideMenu();
      }
    }

    function handleClickOutside(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) {
        hideMenu();
      }
    }

    function hideMenu() {
      setMenuPosition(null);
      setSelectedText(null);
    }

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('scroll', hideMenu);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('scroll', hideMenu);
    };
  }, []);

  return (
    <>
      {menuPosition && selectedText && (
        <div
          ref={menuRef}
          className="bg-bgNavigate rounded-12 absolute z-50 flex gap-4 p-4"
          style={{ top: menuPosition.y, left: menuPosition.x }}
        >
          <button
            className={
              'rounded-8 hover:shadow-s1 hover:bg-bgSec flex size-32 cursor-pointer items-center justify-center bg-transparent duration-300'
            }
            onClick={() => {
              setMenuPosition(null);
            }}
          >
            <HugeiconsIcon className={'size-20'} icon={TextIcon} />
          </button>
          <button
            className={
              'rounded-8 hover:shadow-s1 hover:bg-bgSec flex size-32 cursor-pointer items-center justify-center bg-transparent duration-300'
            }
            onClick={() => {
              setMenuPosition(null);
            }}
          >
            <HugeiconsIcon className={'size-20'} icon={TextIndentIcon} />
          </button>
          <button
            className={
              'rounded-8 hover:shadow-s1 hover:bg-bgSec flex size-32 cursor-pointer items-center justify-center bg-transparent duration-300'
            }
            onClick={() => {
              setMenuPosition(null);
            }}
          >
            <HugeiconsIcon className={'size-20'} icon={Link02Icon} />
          </button>
          <button
            className={
              'rounded-8 hover:shadow-s1 hover:bg-bgSec flex size-32 cursor-pointer items-center justify-center bg-transparent duration-300'
            }
            onClick={() => {
              setMenuPosition(null);
            }}
          >
            <HugeiconsIcon className={'size-20'} icon={TextSmallcapsIcon} />
          </button>
        </div>
      )}
    </>
  );
}
