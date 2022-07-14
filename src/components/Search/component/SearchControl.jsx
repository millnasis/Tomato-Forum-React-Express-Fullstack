import React from "react";
import { Radio } from "antd";

class SearchControl extends React.Component {
  constructor(props) {
    super(props);

    this.changeSearchTarget = this.changeSearchTarget.bind(this);
    this.changeSortMode = this.changeSortMode.bind(this);
  }

  changeSearchTarget(target) {
    let params = this.props.getQueryParams();
    this.props.change_search_target(target);
    let { skip, keyword } = params;
    keyword = decodeURI(keyword);
    this.props.setSearchParams({
      searchTarget: target,
      sortMode: this.props.totalSortMode.NEW,
      skip,
      keyword,
    });
    // this.props.send_to_search(
    //   keyword,
    //   target,
    //   this.props.totalSortMode.NEW,
    //   skip
    // );
  }

  changeSortMode(mode) {
    let params = this.props.getQueryParams();
    let { searchTarget, skip, keyword } = params;
    keyword = decodeURI(keyword);
    this.props.change_sort_mode(mode);
    this.props.setSearchParams({
      searchTarget,
      skip,
      keyword,
      sortMode: mode,
    });
    this.props.send_to_search(keyword, searchTarget, mode, skip);
  }

  render() {
    const { totalSearchTarget, totalSortMode } = this.props;
    return (
      <div className="search-control search-col">
        <div className="search-control-row">
          <label>
            <strong>搜索内容：</strong>
            <Radio.Group name="target" value={this.props.searchTarget}>
              <Radio
                value={totalSearchTarget.POST}
                onClick={this.changeSearchTarget.bind(
                  this,
                  totalSearchTarget.POST
                )}
              >
                帖子
              </Radio>
              <Radio
                value={totalSearchTarget.USER}
                onClick={this.changeSearchTarget.bind(
                  this,
                  totalSearchTarget.USER
                )}
              >
                用户
              </Radio>
            </Radio.Group>
          </label>
        </div>
        <div className="search-control-row">
          <label>
            <strong>排序：</strong>
            {this.props.searchTarget === "POST" && (
              <Radio.Group name="sort" value={this.props.sortMode}>
                <Radio
                  value={totalSortMode.NEW}
                  onClick={this.changeSortMode.bind(this, totalSortMode.NEW)}
                >
                  最新发布
                </Radio>
                <Radio
                  value={totalSortMode.CLICK}
                  onClick={this.changeSortMode.bind(this, totalSortMode.CLICK)}
                >
                  点击最多
                </Radio>
                <Radio
                  value={totalSortMode.LIKE}
                  onClick={this.changeSortMode.bind(this, totalSortMode.LIKE)}
                >
                  点赞最多
                </Radio>
                <Radio
                  value={totalSortMode.REPLY}
                  onClick={this.changeSortMode.bind(this, totalSortMode.REPLY)}
                >
                  回帖最多
                </Radio>
                <Radio
                  value={totalSortMode.FAVORITE}
                  onClick={this.changeSortMode.bind(
                    this,
                    totalSortMode.FAVORITE
                  )}
                >
                  收藏最多
                </Radio>
              </Radio.Group>
            )}
            {this.props.searchTarget === "USER" && (
              <Radio.Group name="sort" value={this.props.sortMode}>
                <Radio
                  value={totalSortMode.NEW}
                  onClick={this.changeSortMode.bind(this, totalSortMode.NEW)}
                >
                  最新创建
                </Radio>
                <Radio
                  value={totalSortMode.LIKE}
                  onClick={this.changeSortMode.bind(this, totalSortMode.LIKE)}
                >
                  点赞最多
                </Radio>
                <Radio
                  value={totalSortMode.POST}
                  onClick={this.changeSortMode.bind(this, totalSortMode.POST)}
                >
                  发帖最多
                </Radio>
              </Radio.Group>
            )}
          </label>
        </div>
      </div>
    );
  }
}

export default SearchControl;
