import * as React from 'react';
import { CardPreview } from '@fluentui/react-components';
import Image from 'next/image';

const resolveAsset = (asset: string) => {
  const ASSET_URL = '/images/';

  return `${ASSET_URL}${asset}`;
};

type Props = {
  isActive: boolean;
};

const MicAnimation = ({}: Props) => (
  <CardPreview>
    <Image height={250} width={250} src={resolveAsset('voiceIcon.png')} alt="Preview of mic" />
  </CardPreview>
);

export default MicAnimation;
