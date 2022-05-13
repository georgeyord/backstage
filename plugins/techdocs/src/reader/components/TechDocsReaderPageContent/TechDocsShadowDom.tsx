/*
 * Copyright 2022 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { memo, PropsWithChildren, useState, useCallback } from 'react';
import { create } from 'jss';
import { StylesProvider, jssPreset } from '@material-ui/styles';

export type TechDocsShadowDomProps = PropsWithChildren<{
  /**
   * Element that is appended to ShadowRoot
   */
  element: Element;
  /**
   * Callback called when element is appended in ShadowRoot
   */
  onAppend: (shadowRoot: ShadowRoot) => void;
}>;

const areEquals = (
  prevProps: TechDocsShadowDomProps,
  nextProps: TechDocsShadowDomProps,
) => {
  const prevElementInnerHTML = prevProps.element.innerHTML;
  const nextElementInnerHTML = nextProps.element.innerHTML;
  // Don't re-render when element inner HTML is still the same
  return prevElementInnerHTML === nextElementInnerHTML;
};

export const TechDocsShadowDom = memo(
  ({ element, onAppend, children }: TechDocsShadowDomProps) => {
    const [jss, setJss] = useState(
      create({
        ...jssPreset(),
        insertionPoint: undefined,
      }),
    );

    const ref = useCallback(
      (shadowHost: HTMLDivElement) => {
        if (!element || !shadowHost) return;

        setJss(
          create({
            ...jssPreset(),
            insertionPoint: element.querySelector('head') || undefined,
          }),
        );

        let shadowRoot = shadowHost.shadowRoot;

        if (!shadowRoot) {
          shadowRoot = shadowHost.attachShadow({ mode: 'open' });
        }

        shadowRoot.replaceChildren(element);

        if (typeof onAppend === 'function') {
          onAppend(shadowRoot);
        }
      },
      [element, onAppend],
    );

    // sheetsManager={new Map()} is needed in order to deduplicate the injection of CSS in the page.
    return (
      <StylesProvider jss={jss} sheetsManager={new Map()}>
        <div ref={ref} data-testid="techdocs-native-shadowroot" />
        {children}
      </StylesProvider>
    );
  },
  areEquals,
);
