import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { Icon } from 'amazeui-touch';

import './select.scss';
/* eslint no-unused-expressions: [0] */
/* eslint arrow-body-style: [0] */
/* eslint react/self-closing-comp: [0] */
/* eslint linebreak-style: [0] */
/* eslint indent: [0] */
/* eslint react/jsx-indent: [0] */
/* eslint max-len: [0] */
/* eslint eol-last: [0] */
export default class HMSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            itemValue: {
                label: '',
                value: '',
            },
        };
        this.selectClick = this.selectClick.bind(this);
        this.itemClick = this.itemClick.bind(this);
    }
    selectClick() {
        this.setState({
            show: !this.state.show,
        });
    }
    itemClick(item, e) {
        this.setState({
            show: false,
        });
        this.props.selectEmit.call(this, e);
    }
    render() {
        const { text } = this.props;
        const hidden = this.state.show ? '' : 'hidden';
        const selectClassName = classNames('select-body flex column', hidden);
        return (
            <div className="hm-select flex column">
                <div className="select-header flex">
                    <span className="flex center">{this.props.text} <Icon className="m5 f14" onClick={this.selectClick} name="down-nav" /></span>
                </div>
                <div className={selectClassName}>
                    {this.props.data.map((item, index) => {
                        return (
                            <div key={index} onClick={(e) => { this.itemClick(e, item); }} className="flex select-item center">{item.label}</div>
                        );
                    })}
                </div>
            </div>
        );
    }

}

HMSelect.defaultProps = {
    // text: 'default value',
    data: [{
        value: 1,
        label: '光谷店',
    }, {
        value: 2,
        label: '徐东店',
    }, {
        value: 3,
        label: '永旺店',
    }, {
        value: 4,
        label: '永旺店',
    }, {
        value: 1,
        label: '光谷店',
    }, {
        value: 2,
        label: '徐东店',
    }, {
        value: 3,
        label: '永旺店',
    }, {
        value: 4,
        label: '永旺店',
    },
    {
        value: 1,
        label: '光谷店',
    }, {
        value: 2,
        label: '徐东店',
    }, {
        value: 3,
        label: '永旺店',
    }, {
        value: 4,
        label: '永旺店',
    },
    {
        value: 1,
        label: '光谷店',
    }, {
        value: 2,
        label: '徐东店',
    }, {
        value: 3,
        label: '永旺店',
    }, {
        value: 4,
        label: '永旺店',
    }, {
        value: 1,
        label: '光谷店',
    }, {
        value: 2,
        label: '徐东店',
    }, {
        value: 3,
        label: '永旺店',
    }, {
        value: 4,
        label: '永旺店',
    }, {
        value: 1,
        label: '光谷店',
    }, {
        value: 2,
        label: '徐东店',
    }, {
        value: 3,
        label: '永旺店',
    }, {
        value: 4,
        label: '永旺店',
    }, {
        value: 1,
        label: '光谷店',
    }, {
        value: 2,
        label: '徐东店',
    }, {
        value: 3,
        label: '永旺店',
    }, {
        value: 4,
        label: '永旺店',
    }, {
        value: 1,
        label: '光谷店',
    }, {
        value: 2,
        label: '徐东店',
    }, {
        value: 3,
        label: '永旺店',
    }, {
        value: 4,
        label: '永旺店',
    }],
};

HMSelect.propTypes = {
    text: PropTypes.string.isRequired,
    data: PropTypes.Array,
    selectEmit: PropTypes.func,
};