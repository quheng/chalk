import os

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
RAW_DATA_DIR = os.path.join(BASE_DIR, 'raw_data')
TOPIC_PATH = os.path.join(BASE_DIR, 'data/lda/topic.json')
DOC_PATH = os.path.join(BASE_DIR, 'data/lda/doc.json')
LDA_MODEL_PATH = os.path.join(BASE_DIR, 'data/lda/lda_model.pkl')
VEC_MODEL_PATH = os.path.join(BASE_DIR, 'data/lda/vec_model.pkl')

STOP_WORDS_PATH = os.path.join(BASE_DIR, 'process/stop_words.txt')

STOP_WORDS = set(line.strip() for line in open(STOP_WORDS_PATH, 'r', encoding='utf-8').readlines())
STOP_WORDS.add('生物谷')
STOP_WORDS.add('2015')
STOP_WORDS.add('2014')
STOP_WORDS.add('2013')
STOP_WORDS.add('亿美元')
STOP_WORDS.add('亿元')
STOP_WORDS.add('万美元')
STOP_WORDS.add('万元')
STOP_WORDS.add('年')
STOP_WORDS.add('月')
STOP_WORDS.add('日')
STOP_WORDS.add('中')
STOP_WORDS.add(' ')
STOP_WORDS.add('新')
STOP_WORDS.add('做')
STOP_WORDS.add('说')
STOP_WORDS.add('推出')
STOP_WORDS.add('发布')
STOP_WORDS.add('建立')
STOP_WORDS.add('提升')
STOP_WORDS.add('一种')
