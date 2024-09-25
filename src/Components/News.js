import React, { useEffect, useState } from 'react';
import Newsitem from './Newsitem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';

const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const updatePage = async () => {
    props.setProgress(10);
    let DataUrl = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    props.setProgress(30);

    setLoading(true);
    let data = await fetch(DataUrl);
    let ParsedData = await data.json();
    props.setProgress(70);

    // Ensure `ParsedData.articles` is defined
    if (ParsedData.articles) {
      setArticles(ParsedData.articles);
      setTotalResults(ParsedData.totalResults || 0);
    }

    setLoading(false);
    props.setProgress(100);
  };

  useEffect(() => {
    updatePage();
    // eslint-disable-next-line
  }, []);

  const fetchMoreData = async () => {
    const newPage = page + 1;
    setPage(newPage);

    let DataUrl = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${newPage}&pageSize=${props.pageSize}`;
    let data = await fetch(DataUrl);
    let ParsedData = await data.json();

    // Ensure `ParsedData.articles` is defined before updating state
    if (ParsedData.articles) {
      setArticles(articles.concat(ParsedData.articles));
      setTotalResults(ParsedData.totalResults || 0);
    }
  };

  const capitalize = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  document.title = `NewsSphere - Daily News | ${capitalize(props.category)}`;

  return (
    <>
      <h1 id="mainhead" className="container text-center">
        Top Headlines - {capitalize(props.category)}
      </h1>
      {loading && <Spinner />}
      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={totalResults !== articles.length}
        loader={<Spinner />}
      >
        <div id="MainNewsComp" className="d-flex">
          <div className="row">
            {articles.map((element) => (
              <div className="col d-flex justify-content-center" key={element.url}>
                <Newsitem
                  urlToImage={element.urlToImage || 'https://www.newsanyway.com/wp-content/uploads/2022/03/In-the-news-4-10-March-2022.jpg'}
                  title={element.title ? element.title.slice(0, 50) : ''}
                  description={element.description ? element.description.slice(0, 100) : ''}
                  url={element.url}
                  author={element.author || 'Unknown'}
                  publishedAt={element.publishedAt}
                  source={element.source.name}
                />
              </div>
            ))}
          </div>
        </div>
      </InfiniteScroll>
    </>
  );
};

export default News;

News.defaultProps = {
  pageSize: 20,
  country: 'in',
  category: 'general',
};

News.propTypes = {
  pageSize: PropTypes.number,
  country: PropTypes.string,
  category: PropTypes.string,
};
